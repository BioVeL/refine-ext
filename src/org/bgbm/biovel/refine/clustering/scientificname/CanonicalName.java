package org.bgbm.biovel.refine.clustering.scientificname;

import java.util.Iterator;
import java.util.TreeSet;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.gbif.ecat.model.ParsedName;
import org.gbif.ecat.parser.NameParser;
import org.gbif.ecat.parser.UnparsableException;

import com.google.refine.clustering.binning.Keyer;


public class CanonicalName extends Keyer {

    static final Pattern alphanum = Pattern.compile("\\p{Punct}|\\p{Cntrl}");
    
    @Override
    public String key(String s, Object... o) {
        NameParser nameParser = new NameParser();
        ParsedName parsedName;
        try {
            parsedName = nameParser.parse(s);
        } catch (UnparsableException e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
            return "";
        }    
        
        return parsedName.canonicalName(); // find ASCII equivalent to characters 
    }
}
