import com.google.template.soy.SoyFileSet;
import com.google.template.soy.jssrc.SoyJsSrcOptions;

import java.util.List;

public class MyCompiler {
    public static void main(String[] args) {
        String soyCode =
            "{namespace example autoescape=\"deprecated\"}\n" +
            "/** Says hello */\n" +
            "{template .hello}\n" +
            "  {@param name: string}\n" +
            "  Hello, {$name}!\n" +
            "{/template}";

        // ✅ Avoid passing a filename to skip any file/resource I/O internally
        SoyFileSet soyFileSet = SoyFileSet.builder()
            .add(soyCode, /* filename */ null)
            .build();

        // ✅ Safe options setup for WASM/native-image
        SoyJsSrcOptions jsOptions = SoyJsSrcOptions.builder().build();

        List<String> jsOutput = soyFileSet.compileToJsSrc(jsOptions, null);

        for (String js : jsOutput) {
            System.out.println(js);
        }
    }
}
