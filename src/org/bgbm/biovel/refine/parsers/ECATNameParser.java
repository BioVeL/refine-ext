/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.bgbm.biovel.refine.parsers;

import java.util.Properties;

import org.gbif.ecat.model.ParsedName;
import org.gbif.ecat.parser.NameParser;
import org.gbif.ecat.parser.UnparsableException;
import org.json.JSONException;
import org.json.JSONWriter;

import com.google.refine.expr.EvalError;
import com.google.refine.expr.Evaluable;
import com.google.refine.expr.ExpressionUtils;
import com.google.refine.grel.Control;
import com.google.refine.grel.ControlFunctionRegistry;
import com.google.refine.grel.Function;

public class ECATNameParser implements Control {
    private static final String SEPARATOR = "|";
    
    @Override
    public String checkArguments(Evaluable[] args) {
        if (args.length != 1) {
            return ControlFunctionRegistry.getControlName(this) + " expects one argument";
        }
        return null;
    }
    
    @Override
    public Object call(Properties bindings, Evaluable[] args) {
        
        Object o;
        StringBuilder sb = new StringBuilder("");
        try {
            o = args[0].evaluate(bindings);                        
            ParsedName pn = parseName((String)o);
            
            if(pn != null) {
                sb.append(pn.buildName(false, false, false, false, false, true, false, false, false, false, false));
                sb.append(SEPARATOR);
                sb.append(pn.authorshipComplete());
            }
        } catch (Exception e) {
            o = new EvalError(e.toString());            
        } 
        
        return sb.toString();
    }


    
    @Override
    public void write(JSONWriter writer, Properties options) throws JSONException {
    
        writer.object();
        writer.key("description"); writer.value("Parses scientific names using the GBIF-ECAT Name Parser");
        writer.key("params"); writer.value("string s");
        writer.key("returns"); writer.value("string");
        writer.endObject();
    }
    
    private ParsedName parseName(String name) {
        NameParser nameParser = new NameParser();
        ParsedName parsedName;
        try {
            parsedName = nameParser.parse(name);
        } catch (UnparsableException e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
            parsedName = null;
        }        
        return parsedName;
    }
    
}
