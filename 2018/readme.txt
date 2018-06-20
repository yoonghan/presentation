==========================================================================================
PARTY 0
==========================================================================================
/*class Person {
  private String name;
  private String gender;
}*/

case class Person(var name:String, var gender:String)
case class SetPerson(val name:String)


import akka.actor._

object IotSupervisor {
  def props(): Props = Props(new IotSupervisor())
}

class IotSupervisor() extends Actor with ActorLogging {

  val person = Person("Sample", "12")

  // No need to handle any messages
  override def receive = {
    case SetPerson(newname) => {
      person.name = newname
    }
    case _ => println("Person is:"+person.name)
  }
}


==========================================================================================
PARTY 1
==========================================================================================
import akka.actor._

object IotSupervisor {
  def props(): Props = Props(new IotSupervisor)
}

class IotSupervisor extends Actor with ActorLogging {
  override def preStart(): Unit = log.info("IoT Application started")
  override def postStop(): Unit = log.info("IoT Application stopped")

  // No need to handle any messages
  override def receive = {
    case _ => println("Received")
  }
}

val system = ActorSystem("iot-system")
val supervisor = system.actorOf(IotSupervisor.props(), "iot-supervisor")

supervisor ! "Test"

system.terminate()

; sender ! "Ok"
import scala.concurrent.duration._
import akka.util.Timeout
import akka.pattern.ask
import scala.concurrent.Await

implicit val timeout = Timeout(5 seconds)
Await.result((supervisor ? "Test"), 6 seconds)

==========================================================================================
PARTY 2
==========================================================================================
val conf="""
akka{
  actor {
    provider="akka.remote.RemoteActorRefProvider"
  }
  remote {
    enabled-transport=["akka.remote.netty.tcp"]
    netty.tcp {
      hostname="0.0.0.0"
      port = 2551
    }
  }
}
"""

import com.typesafe.config._
import akka.actor._
val config = ConfigFactory.parseString(conf)
val backend=ActorSystem("backend", config)

class Simple extends Actor {
  def receive = {
    case m => println(s"received $m!")
  }
}

backend.actorOf(Props[Simple], "simple")

val conf="""
akka{
  actor {
    provider="akka.remote.RemoteActorRefProvider"
  }
  remote {
    enabled-transport=["akka.remote.netty.tcp"]
    netty.tcp {
      hostname="0.0.0.0"
      port = 2552
    }
  }
}
"""

import com.typesafe.config._
import akka.actor._
val config = ConfigFactory.parseString(conf)
val frontend=ActorSystem("frontend", config)

val path = "akka.tcp://backend@0.0.0.0:2551/user/simple"
val simple = frontend.actorSelection(path)


frontend.terminate
backend.terminate
