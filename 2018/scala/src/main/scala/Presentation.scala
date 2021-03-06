case class OpenMarket(val event:String, val ticket:Int)
case class Sell(val event:String)
case class Get(val event:String)
case class SetFilename(val filename:String)
case class ShowPath(val event:String)

import akka.actor._
import scala.concurrent._
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.duration._
import scala.io.Source
import akka.actor.SupervisorStrategy._
import java.io._
import akka.util.Timeout
import scala.concurrent.duration._


object TicketSeller {
  def props(tickets:Int): Props = Props(new TicketSeller(tickets))
}

class TicketSeller(val tickets:Int) extends Actor {

  var ticketsInHand = tickets

  override def receive = {
    case Sell(event) => {
      ticketsInHand = ticketsInHand - 1
      println("Sold 1 and left:"+ticketsInHand)
    }
    case Get(event) => {
      sender() ! ticketsInHand
    }
    case ShowPath(event) => {
      println(">>" + self.path)
    }
    case _ => println("No such Method")
  }
}

object TicketSellerCreator {
  def props(): Props = Props(new TicketSellerCreator())
}

class TicketSellerCreator() extends Actor {
  import context._

  override def receive = {
    case OpenMarket(event, ticket) => {
      println("Created a child")
      val actor = context.actorOf(TicketSeller.props(ticket), event)
    }
    case Sell(event) => {
      println("Inquired for selling.")
      context.child(event).get.forward(Sell(event))
    }
    case Get(event) => {
      context.child(event).get.forward(Get(event))
    }
    case ShowPath(event) => {
      context.child(event).get.forward(ShowPath(event))
    }
    case _ => println("""No such method""")
  }
}

object TicketSellerV3 {
  def props(tickets:Int): Props = Props(new TicketSellerV3(tickets))
}

class TicketSellerV3(val tickets:Int) extends Actor {

  var ticketsInHand = tickets

  val filename = "/Users/mmpkl05/personal/presentation/2018/textfile/sample1.txt"
  val filename2 = "/Users/mmpkl05/personal/presentation/2018/textfile/sample2.txt"
  var readFileSource = filename

  implicit val timeout = Timeout(5 seconds)

  override def preRestart(reason: Throwable, message: Option[Any]): Unit = {
    println("Pre restart:")
    if(message.isDefined) {
      println(">>"+message)
      sender() ?  message.get
    }
    super.preRestart(reason, message)
  }

  override def postRestart(reason: Throwable) {
    println("Finish PreRestart")
    readFileSource = filename2
    println("Post Start: " + readFileSource)
    super.postRestart(reason)
  }

  override def preStart() = {
    println("Start: " + readFileSource)
    super.preStart()
  }

  def readFile() = {
    println("READING FILE")
    try {
      Source.fromFile(readFileSource)
    }
    catch {
      case ioe:FileNotFoundException => {
        if(filename2.equals(readFileSource)) {
          throw new EOFException
        }
        else {
          throw ioe
        }
      }
    }
  }

  override def receive() = {
    case Sell(event) => {
      ticketsInHand = ticketsInHand - 1
      println("Children selling, remain:"+ticketsInHand)
    }
    case Get(event) => {
      readFile()
      sender() ! ticketsInHand
    }
    case SetFilename(filename) => {
      readFileSource = filename
    }
    case _ => println("No such Method")
  }
}

object TicketSellerCreatorV3 {
  def props(): Props = Props(new TicketSellerCreatorV3())
}

class TicketSellerCreatorV3() extends Actor {
  import context._

  override val supervisorStrategy =
    OneForOneStrategy(maxNrOfRetries = 10, withinTimeRange = 1 minute) {
      case _: FileNotFoundException    => Restart
      case _: EOFException             => Stop
      case _: Exception                => Resume
    }

  override def receive() = {
    case OpenMarket(event, ticket) => {
      println("Open Market")
      val actor = context.actorOf(TicketSellerV3.props(ticket), event)
    }
    case Sell(event) => {
      println("Sell")
      context.child(event).get.forward(Sell(event))
    }
    case Get(event) => {
      println("Get")
      context.child(event).get.forward(Get(event))
    }
    case _ => println("""No such method 2""")
  }
}
