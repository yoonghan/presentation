package unicast.tcp.sample;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class TcpServer extends Thread{
    private Address[] addresses = new Address[10];
    private ServerSocket socket = new ServerSocket(4554);
    
    public static void main(String[] args) throws IOException {
        new TcpServer().start();
    }
    
    public TcpServer() throws IOException {
        super("Data packet");
    }

    public void run() {
        int pos = 0;

        
        System.out.println("Server activated.");
        
        while(true){
            try{
                Socket clientSocket = socket.accept();
                
                InetAddress userAddress = clientSocket.getInetAddress();
                int port = clientSocket.getPort();
                addresses[pos++] = new Address(userAddress, port, new PrintWriter(clientSocket.getOutputStream(), true));
                
                String buf = String.format("ip: %s, port: %d" ,userAddress.getHostAddress(), port);
                
                for(Address address: addresses){
                    if(address != null){
                        address.getOut().println(buf);
                        System.out.println(String.format("Sent to: %s, port: %d, error: %s" , address.getInetAddress().getHostAddress(), address.getPort(), address.getOut().checkError()));
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
    private final PrintWriter out;
    
    public Address(InetAddress inetAddress, int port, PrintWriter out){
        this.inetAddress = inetAddress;
        this.port = port;
        this.out = out;
    }
    
    public int getPort(){
        return port;
    }
    
    public InetAddress getInetAddress(){
        return inetAddress;
    }

    public PrintWriter getOut() {
        return out;
    }
}