package org.bgbm.biovel.refine.commands;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.bgbm.biovel.refine.updater.ExtensionUpdater;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import com.google.refine.commands.Command;



public class BiovelExtensionUpdaterCommand extends Command {

    final static Logger logger = LoggerFactory.getLogger("biovel-update_command");

    private static final String CHECK_VERSION = "check-current-version";
    private static final String DEL_CURRENT = "delete-current-version";
    private static final String DLD_NEW = "download-new-version";
    private static final String INSTALL_NEW = "install-new-version";
        
    private static final String EXT_DIR = "." + File.separator + "webapp" + File.separator + "extensions" + File.separator;
    
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        try {
            JSONObject update_conf = getJsonParameter(request,"updater");
            
            String action = update_conf.has("action") ? update_conf.getString("action") : "";
            String extension = update_conf.has("extension") ? update_conf.getString("extension") : "";
            String baseurl = update_conf.has("baseurl") ? update_conf.getString("baseurl") : "";
            
            if(action.equals(CHECK_VERSION)) {
                respondJSON(response, checkCurrentVersion(baseurl, extension));
            }            
            if(action.equals(DEL_CURRENT)) {
                respondJSON(response, removeCurrentVersion(extension));
            }
            if(action.equals(DLD_NEW)) {
                respondJSON(response, downloadNewVersion(baseurl, extension));
            }
            if(action.equals(INSTALL_NEW)) {
                respondJSON(response, installNewVersion(extension));
            }
            
        } catch (Exception e) {
            respondException(response, e);
        }
    }
    private ExtensionUpdater checkCurrentVersion(String baseUrl, String extension) {
        ExtensionUpdater eu = new ExtensionUpdater();
        Properties prop = new Properties();

        logger.info("Checking version...");
        try {
            //load a properties file
            prop.load(new FileInputStream(EXT_DIR + "biovel/module/MOD-INF/module.properties"));

            //get the property value and print it out
            String localVersion = prop.getProperty("version", "");
            eu.setLocalVersion(localVersion);
            logger.info("Local version : " + localVersion);
            
            HttpClient client = new DefaultHttpClient();
            HttpGet get = new HttpGet(baseUrl + "/module.properties");
            HttpResponse response;
            logger.info("Connecting to " + baseUrl);
            try {
                response = client.execute(get);
            } catch (ClientProtocolException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                eu.setSuccess(false);
                eu.setPostAction(null);
                eu.setResult(e.getMessage());
                return eu;
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                eu.setSuccess(false);
                eu.setPostAction(null);
                eu.setResult(e.getMessage());
                return eu;
            }

            InputStream input = response.getEntity().getContent();
            prop.load(input);
            String remoteVersion = prop.getProperty("version", "");
            logger.info("Remote version : " + remoteVersion);
            if(!localVersion.equals(remoteVersion)) {
                eu.setSuccess(true);
                eu.setPostAction(DEL_CURRENT);
                eu.setResult("New version available");
            } else {
                eu.setSuccess(false);
                eu.setPostAction(null);
                eu.setResult("Current version is up-to-date");
            }

        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return eu;

    }
    private ExtensionUpdater removeCurrentVersion(String extension) {
        logger.info("Removing current version...");
        File file = new File(EXT_DIR + extension);
        
        ExtensionUpdater eu = new ExtensionUpdater();
        eu.setPostAction(DLD_NEW);
        if(!file.exists()) {
            eu.setSuccess(true);
            eu.setResult(file.getAbsolutePath() + ": no such" + " file or directory");
            return eu;
        }
        
        try {
            delete(file);
        } catch (Exception x) {
            // File permission problems are caught here.
            System.err.println(x);
            eu.setSuccess(false);
            eu.setPostAction(null);
            eu.setResult(x.getMessage());
            return eu;
        }
        eu.setSuccess(true);
        eu.setResult("Current version of extension removed successfully");
        return eu;
    }
    
    private void delete(File file) {            

        if(file.isDirectory()){     
            //directory is empty, then delete it
            if(file.list().length==0){     
                file.delete();                
            }else{     
                //list all the directory contents
                String files[] = file.list();     
                for (String temp : files) {
                    //construct the file structure
                    File fileDelete = new File(file, temp);     
                    //recursive delete
                    delete(fileDelete);
                }     
                //check the directory again, if empty then delete it
                if(file.list().length==0){
                    file.delete();                    
                }
            }
        }else{
            //if file, then delete it
            file.delete();
            
        }
    }
    
    private ExtensionUpdater downloadNewVersion(String baseUrl, String extension) {
        logger.info("Downloading new version");
        
        ExtensionUpdater eu = new ExtensionUpdater();
        eu.setPostAction(INSTALL_NEW);
        HttpClient client = new DefaultHttpClient();
        logger.info("Connecting to " + baseUrl);
        HttpGet get = new HttpGet(baseUrl + "/" + extension + ".zip");
        HttpResponse response;
        try {
            response = client.execute(get);
        } catch (ClientProtocolException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            eu.setSuccess(false);
            eu.setPostAction(null);
            eu.setResult(e.getMessage());
            return eu;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            eu.setSuccess(false);
            eu.setPostAction(null);
            eu.setResult(e.getMessage());
            return eu;
        }

        InputStream input = null;
        OutputStream output = null;
        byte[] buffer = new byte[1024];

        try {
            logger.info("Downloading file...");
            input = response.getEntity().getContent();
            output = new FileOutputStream(EXT_DIR + extension + ".zip");
            for (int length; (length = input.read(buffer)) > 0;) {
                output.write(buffer, 0, length);
            }
            logger.info("File successfully downloaded!");
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            eu.setSuccess(false);
            eu.setPostAction(null);
            eu.setResult(e.getMessage());
            return eu;            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            eu.setSuccess(false);
            eu.setPostAction(null);
            eu.setResult(e.getMessage());
            return eu;            
        } finally {
            if (output != null) 
                try { 
                    output.close(); 
                    } catch (IOException logOrIgnore) {}
            if (input != null) 
                try { 
                    input.close(); 
                    } catch (IOException logOrIgnore) {}
        }
        eu.setSuccess(true);
        eu.setResult("Current version of extension downloaded successfully");
        return eu;
    }

    private ExtensionUpdater installNewVersion(String extension) {
        ExtensionUpdater eu = new ExtensionUpdater();
        eu.setPostAction(null);
        String outputFolder = EXT_DIR;
        byte[] buffer = new byte[1024];
        logger.info("Unzipping file ....");
        try{

            //create output directory is not exists
            File folder = new File(outputFolder);
            if(!folder.exists()){
                folder.mkdir();
            }

            //get the zip file content
            ZipInputStream zis =  new ZipInputStream(new FileInputStream(EXT_DIR + extension + ".zip"));
            //get the zipped file list entry
            ZipEntry ze = zis.getNextEntry();

            while(ze!=null){

                String fileName = ze.getName();
                File newFile = new File(outputFolder + File.separator + fileName);

                System.out.println("file unzip : "+ newFile.getAbsoluteFile());

                //create all non exists folders
                //else you will hit FileNotFoundException for compressed folder
                new File(newFile.getParent()).mkdirs();
                if(!ze.isDirectory()) {
                    FileOutputStream fos = new FileOutputStream(newFile);             

                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        fos.write(buffer, 0, len);
                    }

                    fos.close();
                }
                ze = zis.getNextEntry();
            }

            zis.closeEntry();
            zis.close();

            logger.info("Install sucessful");
            logger.info("Deleting .zip file");
            delete(new File(EXT_DIR + extension + ".zip"));
            logger.info("Deletion successful");
        } catch(Exception ex) {
            ex.printStackTrace(); 
            eu.setSuccess(false);
            eu.setResult(ex.getMessage());
            return eu;
        }
        eu.setSuccess(true);
        eu.setResult("New version of extension installed successfully.\nPlease restart Google Refine for the changes to take effect");
        return eu;
    }           
}


