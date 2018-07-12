package multicast.udp.sample;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;

public class UdpSender extends Thread{
    private final int PORT = 4556;
    private final MulticastSocket socket = new MulticastSocket(PORT);
    private final int SLEEP_TIME = 2000;
    private final String HOST_NAME;
    
    
    public static void main(String[] args) throws IOException {
        if(args.length != 1){
            System.err.println("Please key in the computer hostname");
            System.exit(1);
        }
        new UdpSender(args[0]).start();
    }
    
    public UdpSender(String hostname) throws IOException {
        super("Data packet");
        this.HOST_NAME = hostname; 
    }

    public void run() {
        System.out.println("Sender activated.");
        
        while(true){
            try{
                byte[] buf = new byte[256];
                buf = HOST_NAME.getBytes();
                DatagramPacket packet = new DatagramPacket(buf, buf.length);
                
                InetAddress group = InetAddress.getByName("230.0.0.1");
                System.out.println("Sending data now");
                packet = new DatagramPacket(buf, buf.length, group, PORT);
                socket.send(packet);
                System.out.println("\n-----Sleeping-----\n");
                Thread.sleep(SLEEP_TIME);
            }catch(IOException ioe){
                ioe.printStackTrace();
            }
            catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }  
}
