import com.google.template.soy.SoyFileSet;
import com.google.template.soy.jssrc.SoyJsSrcOptions;
import java.util.*;

public class SoyCompiler {
    public static String compileSoyToJs(String soyCode, String filename) {
        SoyFileSet soyFileSet = SoyFileSet.builder()
            .add(soyCode, /* filename */ filename)
            .build();

        // ✅ Safe options setup for WASM/native-image
        SoyJsSrcOptions jsOptions = SoyJsSrcOptions.builder().build();

        List<String> jsOutput = soyFileSet.compileToJsSrc(jsOptions, null);

        return String.join(System.lineSeparator(), jsOutput);
    }
}
