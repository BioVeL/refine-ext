package org.bgbm.biovel.refine.clustering.scientificname;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

import org.bgbm.biovel.drf.checklist.GBIFBackboneClient;
import org.bgbm.biovel.drf.rest.TaxoRESTClient.ServiceProviderInfo;
import org.bgbm.biovel.drf.tnr.msg.TnrMsg;
import org.bgbm.biovel.drf.tnr.msg.TnrResponse;
import org.bgbm.biovel.drf.utils.TnrMsgUtils;
import org.gbif.ecat.model.ParsedName;
import org.json.JSONException;
import org.json.JSONWriter;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;

import com.google.refine.expr.EvalError;
import com.google.refine.expr.Evaluable;
import com.google.refine.grel.Control;
import com.google.refine.grel.ControlFunctionRegistry;


public class GBIFAccNameResolver implements Control {
    

    @Override
    public String checkArguments(Evaluable[] args) {
        if (args.length != 2) {
            return ControlFunctionRegistry.getControlName(this) + " expects two argument";
        }
        return null;
    }


    @Override
    public Object call(Properties bindings, Evaluable[] args) {
        String datasetId;
        String name;
        TnrMsg tnrMsg;
        String acceptedName = "";
        try {
            datasetId = (String)args[0].evaluate(bindings);                        
            name = (String)args[1].evaluate(bindings);
            ServiceProviderInfo ci;
            ci = new ServiceProviderInfo(GBIFBackboneClient.ID,
                    GBIFBackboneClient.LABEL,
                    GBIFBackboneClient.URL,
                    GBIFBackboneClient.DATA_AGR_URL);
            ci.addSubChecklist(new ServiceProviderInfo(datasetId, 
                    "GBIF NUB Taxonomy", 
                    "http://uat.gbif.org/dataset/" + datasetId));
            tnrMsg = TnrMsgUtils.convertStringToTnrMsg(name);
            GBIFBackboneClient gbc =  new GBIFBackboneClient(ci);
            gbc.queryChecklist(tnrMsg);
            //List<TnrResponse> tnrResponseList = tnrMsg.getQuery().get(0).getTnrResponse();
            //if(tnrResponseList.size() > 0) {
              //  acceptedName = tnrResponseList.get(0).getAcceptedName().getTaxonName().getName().getNameCanonical();
           // }
           
        } catch (Exception e) {
            return new EvalError(e.toString());            
        } 
        
        try {
            return TnrMsgUtils.convertTnrMsgToJson(tnrMsg);
        } catch (JsonGenerationException e) {
            return new EvalError(e.toString());   
        } catch (JsonMappingException e) {
            return new EvalError(e.toString());   
        } catch (IOException e) {
            return new EvalError(e.toString());   
        }
    }
    
    @Override
    public void write(JSONWriter writer, Properties options)
            throws JSONException {
        writer.object();
        writer.key("description"); writer.value("Resolves a scientific name to its accepted name and related information");
        writer.key("params"); writer.value("string datasetId, string name");
        writer.key("returns"); writer.value("string");
        writer.endObject();
        
    }


    

}
