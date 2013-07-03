package org.bgbm.biovel.refine.dqc;

import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONWriter;

import com.google.refine.expr.EvalError;
import com.google.refine.expr.Evaluable;
import com.google.refine.expr.ExpressionUtils;
import com.google.refine.grel.Control;
import com.google.refine.grel.ControlFunctionRegistry;



public class LatLongValidity implements Control {

    private final static String BOTH_EMPTY="both empty";
    private final static String ONE_EMPTY="one empty";
    private final static String BOTH_ZERO="both zero";
    private final static String ONE_ZERO="one zero";
    private final static String NOT_NUMERIC="not numeric";
    private final static String UNKNOWN_REASON="unknown reason";
    private final static String VALID="valid";

    @Override
    public String checkArguments(Evaluable[] args) {
        if (args.length != 2) {
            return ControlFunctionRegistry.getControlName(this) + " expects two arguments";
        }
        return null;
    }

    @Override
    public Object call(Properties bindings, Evaluable[] args) {

        Object o1,o2;
        try {

            o1 = args[0].evaluate(bindings);
            o2 = args[1].evaluate(bindings);

            if(!ExpressionUtils.isNonBlankData(o1) && !ExpressionUtils.isNonBlankData(o2)) {
                return BOTH_EMPTY;
            } 

            if(!ExpressionUtils.isNonBlankData(o1) || !ExpressionUtils.isNonBlankData(o2)) {
                return ONE_EMPTY;
            }

            if(!(isNumeric(o1) && isNumeric(o2))) {              
                return NOT_NUMERIC;
            }

            if(isZero(o1) && isZero(o2)) {
                return BOTH_ZERO;
            } 

            if(isZero(o1) || isZero(o2)) {
                return ONE_ZERO;
            }             


        } catch (Exception e) {
            return UNKNOWN_REASON;
        } 


        return VALID;
    }

    private boolean isZero(Object o)  {
        try {
            return
                    o != null &&                
                    (o instanceof String) && (Float.parseFloat((String)o) == 0.0);
        } catch (NumberFormatException nfe) {
            return false;
        }
    }

    private boolean isNumeric(Object o) {
        if (o instanceof Number) {
            return true;
        }

        String s = (o instanceof String) ? (String) o : o.toString();

        //FIXME : Exception throwing is not efficient. Regex parsing is better
        try  
        {  
            double d = Double.parseDouble(s);  
        }  
        catch(NumberFormatException nfe)  
        {  
            return false;  
        }  
        return true;
    }

    @Override
    public void write(JSONWriter writer, Properties options)
            throws JSONException {

        writer.object();
        writer.key("description"); writer.value("Validates the Latitude / Longitude values");
        writer.key("params"); writer.value("string s1, string s2");
        writer.key("returns"); writer.value("string");
        writer.endObject();
    }

}
