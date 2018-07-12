package unicast.tcp.sample;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.net.UnknownHostException;

public class TcpClient extends Thread{
    
    public static void main(String[] args) throws UnknownHostException, IOException{
        String connectionIp = "127.0.0.1";
        
        if(args.length != 0) {
            connectionIp = args[0];
        }
        
        System.out.println("Running Client");
        new TcpClient(connectionIp).start();;
    }
    
    private final Socket socket;
    
    public TcpClient(String connectionIp) throws UnknownHostException, IOException{
        super("Client Socket");
        socket = new Socket(connectionIp, 4554);
    }
    
    public void run() {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            while(true){
                String received = in.readLine();
                System.out.println("Yoodle, you received: " + received);
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
