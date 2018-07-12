package multicast.udp.sample;

import java.io.IOException;
import java.net.SocketException;

public class UdpExecutor {
    public static void main(String[] args) throws IOException, SocketException{
        if(args.length != 1){
            System.err.println("Please key in the computer hostname");
            System.exit(1);
        }
        
        new UdpSender(args[0]).start(); //Start broadcasting the ip
        new UdpReceiver(args[0]).start(); //Look for the message so that we can stop to process
    }
}
