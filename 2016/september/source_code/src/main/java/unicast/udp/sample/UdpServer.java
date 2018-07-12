package unicast.udp.sample;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UdpServer extends Thread{
    private Address[] addresses = new Address[10];
    private DatagramSocket socket = new DatagramSocket(4445);
    
    public static void main(String[] args) throws IOException {
        new UdpServer().start();
    }
    
    public UdpServer() throws IOException {
        super("Data packet");
    }

    public void run() {
        int pos = 0;
        
        System.out.println("Server activated.");
        
        while(true){
            try{
                byte[] buf = new byte[256];
                DatagramPacket packet = new DatagramPacket(buf, buf.length);
                socket.receive(packet);
                
                InetAddress userAddress = packet.getAddress();
                int port = packet.getPort();
                addresses[pos++] = new Address(userAddress, port);
                
                buf = String.format("Added: ip: %s, port: %d" ,userAddress.getHostAddress(), port).getBytes();
                
                for(Address address: addresses){
                    if(address != null){
                        System.out.println(String.format("Sending to: %s, port: %d" , address.getInetAddress().getHostAddress(), address.getPort()));
                        packet = new DatagramPacket(buf, buf.length, address.getInetAddress(), address.getPort());
                        socket.send(packet);
                    }
                }
                System.out.println("-----\nI'm done\n-----");
            }catch(IOException ioe){
                ioe.printStackTrace();
            }
        }
    }  
}

class Address{
    private final InetAddress inetAddress;
    private final int port;
    
    public Address(InetAddress inetAddress, int port){
        this.inetAddress = inetAddress;
        this.port = port;
    }
    
    public int getPort(){
        return port;
    }
    
    public InetAddress getInetAddress(){
        return inetAddress;
    }
}