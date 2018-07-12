package unicast.udp.sample;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

public class UdpClient extends Thread{
    
    public static void main(String[] args) throws SocketException{
        String connectionIp = "127.0.0.1";
        if(args.length != 0) {
            connectionIp = args[0];
        }
        
        System.out.println("Running Client");
        new UdpClient(connectionIp).start();;
    }
    
    private final DatagramSocket socket;
    private final String connectionIp;
    
    public UdpClient(String connectionIp) throws SocketException{
        super("Client Socket");
        this.connectionIp = connectionIp;
        socket = new DatagramSocket();
    }
    
    public void run() {
        // send request
        byte[] buf = new byte[256];
        InetAddress address;
        try {
            address = InetAddress.getByName(connectionIp);
            DatagramPacket packet = new DatagramPacket(buf, buf.length, address, 4445);
            socket.send(packet);
            
            packet = new DatagramPacket(buf, buf.length);
            while(true){
                try {
                    socket.receive(packet);
                    String received = new String(packet.getData(), 0, packet.getLength());
                    System.out.println("Yoodle, you received: " + received);
                }
                catch (IOException e) {
                    e.printStackTrace();
                }
            }
            //socket.close();
        }
        catch (UnknownHostException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }
}
