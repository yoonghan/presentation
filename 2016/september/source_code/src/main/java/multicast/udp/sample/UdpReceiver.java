package multicast.udp.sample;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;
import java.net.SocketException;

public class UdpReceiver extends Thread{
    private final int PORT = 4556;
    private final String KEY = "_OK";
    private final String HOST_NAME;
    private final MulticastSocket socket = new MulticastSocket(PORT);
    private final InetAddress address = InetAddress.getByName("230.0.0.1");
    
    public static void main(String[] args) throws IOException, SocketException{
        if(args.length != 1){
            System.err.println("Please key in the computer hostname");
            System.exit(1);
        }
        new UdpReceiver(args[0]).start();
    }
    
    public UdpReceiver(String hostname) throws IOException{
        HOST_NAME = hostname;
        socket.joinGroup(address);
    }
        
    public void run(){   
        DatagramPacket packet;
        
        try{
            while(true){
                byte[] buf = new byte[256];
                packet = new DatagramPacket(buf, buf.length);

                socket.receive(packet);
            
                String received = new String(packet.getData(), 0, packet.getLength());
                
                System.out.println("Text at the Moment: " + received);
                
                if(received.equals(KEY + HOST_NAME) ){
                    System.exit(0);
                }
                
                Thread.sleep(1000);
            }
            
        }
        catch(IOException ioe) {
            ioe.printStackTrace();
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
        finally {
            try {
                socket.leaveGroup(address);
            }
            catch (IOException e) {
                //do nothing man
            }
            socket.close();
        }
    }
}
