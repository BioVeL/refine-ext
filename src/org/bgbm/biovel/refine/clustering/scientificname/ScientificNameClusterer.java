package org.bgbm.biovel.refine.clustering.scientificname;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;
import java.util.Map.Entry;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.refine.browsing.Engine;
import com.google.refine.browsing.FilteredRows;
import com.google.refine.browsing.RowVisitor;
import com.google.refine.clustering.Clusterer;
import com.google.refine.clustering.binning.ColognePhoneticKeyer;
import com.google.refine.clustering.binning.DoubleMetaphoneKeyer;
import com.google.refine.clustering.binning.FingerprintKeyer;
import com.google.refine.clustering.binning.Keyer;
import com.google.refine.clustering.binning.Metaphone3Keyer;
import com.google.refine.clustering.binning.MetaphoneKeyer;
import com.google.refine.clustering.binning.NGramFingerprintKeyer;
import com.google.refine.clustering.binning.SoundexKeyer;
import com.google.refine.clustering.binning.BinningClusterer.EntriesComparator;
import com.google.refine.clustering.binning.BinningClusterer.SizeComparator;
import com.google.refine.model.Cell;
import com.google.refine.model.Project;
import com.google.refine.model.Row;


public class ScientificNameClusterer extends Clusterer {

    private Keyer _keyer;
    
    static final protected Map<String, Keyer> _keyers = new HashMap<String, Keyer>();

    final static Logger logger = LoggerFactory.getLogger("sciname_clusterer");
    
    List<Map<String,Integer>> _clusters;
     
    static {
        _keyers.put("canonical-name", new CanonicalName());
        
    }

    class ScientificNameRowVisitor implements RowVisitor {

        Keyer _keyer;
        Object[] _params;
        JSONObject _config;
        
        Map<String,Map<String,Integer>> _map = new HashMap<String,Map<String,Integer>>();
        
        public ScientificNameRowVisitor(Keyer k, JSONObject o) {
            _keyer = k;
            _config = o;
            
        }
        
        @Override
        public void start(Project project) {
            // nothing to do
        }

        @Override
        public void end(Project project) {
            // nothing to do
        }
        
        @Override
        public boolean visit(Project project, int rowIndex, Row row) {
            Cell cell = row.getCell(_colindex);
            if (cell != null && cell.value != null) {
                Object v = cell.value;
                String s = (v instanceof String) ? ((String) v) : v.toString();
                String key = _keyer.key(s,_params);
                if (_map.containsKey(key)) {
                    Map<String,Integer> m = _map.get(key);
                    if (m.containsKey(s)) {
                        m.put(s, m.get(s) + 1);
                    } else {
                        m.put(s,1);
                    }
                } else {
                    Map<String,Integer> m = new TreeMap<String,Integer>();
                    m.put(s,1);
                    _map.put(key, m);
                }
            }
            return false;
        }
        
        public Map<String,Map<String,Integer>> getMap() {
            return _map;
        }
    }
            
    public static class SizeComparator implements Comparator<Map<String,Integer>>, Serializable {
        private static final long serialVersionUID = -1390696157208674054L;
        @Override
        public int compare(Map<String,Integer> o1, Map<String,Integer> o2) {
            int s1 = o1.size();
            int s2 = o2.size();
            if (o1 == o2) {
                int total1 = 0;
                for (int i : o1.values()) {
                    total1 += i;
                }
                int total2 = 0;
                for (int i : o2.values()) {
                    total2 += i;
                }
                return total2 - total1;
            } else {
                return s2 - s1;
            }
        }
    }

    public static class EntriesComparator implements Comparator<Entry<String,Integer>>, Serializable {
        private static final long serialVersionUID = 2763378036791777964L;
        @Override
        public int compare(Entry<String,Integer> o1, Entry<String,Integer> o2) {
            return o2.getValue() - o1.getValue();
        }
    }
    
    @Override
    public void initializeFromJSON(Project project, JSONObject o) throws Exception {
        super.initializeFromJSON(project, o);
        _keyer = _keyers.get(o.getString("function").toLowerCase());
    }

    @Override
    public void computeClusters(Engine engine) {
        ScientificNameRowVisitor visitor = new ScientificNameRowVisitor(_keyer,_config);
        FilteredRows filteredRows = engine.getAllFilteredRows();
        filteredRows.accept(_project, visitor);
     
        Map<String,Map<String,Integer>> map = visitor.getMap();
        _clusters = new ArrayList<Map<String,Integer>>(map.values());
        Collections.sort(_clusters, new SizeComparator());
    }
    
    @Override
    public void write(JSONWriter writer, Properties options) throws JSONException {
        EntriesComparator c = new EntriesComparator();
        
        writer.array();        
        for (Map<String,Integer> m : _clusters) {
            if (m.size() > 1) {
                writer.array();        
                List<Entry<String,Integer>> entries = new ArrayList<Entry<String,Integer>>(m.entrySet());
                Collections.sort(entries,c);
                for (Entry<String,Integer> e : entries) {
                    writer.object();
                    writer.key("v"); writer.value(e.getKey());
                    writer.key("c"); writer.value(e.getValue());
                    writer.endObject();
                }
                writer.endArray();
            }
        }
        writer.endArray();
    }
}

