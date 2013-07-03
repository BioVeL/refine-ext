package org.bgbm.biovel.refine.updater;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Map.Entry;

import org.bgbm.biovel.refine.clustering.scientificname.ScientificNameClusterer.EntriesComparator;
import org.json.JSONException;
import org.json.JSONWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.refine.Jsonizable;




public class ExtensionUpdater implements Jsonizable {
    
    final static Logger logger = LoggerFactory.getLogger("biovel-updater");
    
    private boolean success = false;
    private String result = "";
    private String postAction = "";
    private String localVersion = "";
    
    public ExtensionUpdater() {        
    }

    @Override
    public void write(JSONWriter writer, Properties options)
            throws JSONException {        
        writer.object();
        writer.key("success"); 
        writer.value(isSuccess());
        writer.key("result"); 
        writer.value(getResult());
        writer.key("postaction"); 
        writer.value(getPostAction());
        writer.key("localversion"); 
        writer.value(getLocalVersion());
        writer.endObject();       
        
    }


    public boolean isSuccess() {
        return success;
    }


    public void setSuccess(boolean success) {
        this.success = success;
    }


    public String getResult() {
        return result;
    }


    public void setResult(String result) {
        this.result = result;
    }


    public String getPostAction() {
        return postAction;
    }


    public void setPostAction(String postAction) {
        this.postAction = postAction;
    }
    
    public String getLocalVersion() {
        return localVersion;
    }
   
    public void setLocalVersion(String localVersion) {
        this.localVersion = localVersion;
    }

}
