import com.google.template.soy.SoyFileSet;
import com.google.template.soy.jssrc.SoyJsSrcOptions;
import java.util.List;

public class MyCompiler {
    public static String compile() {
        return "example string";
        // String soy = "{namespace ex}\n{template .t}\n{@param name: string}\nHello {$name}!\n{/template}";
        // SoyFileSet sfs = SoyFileSet.builder().add(soy, "inline.soy").build();
        // List<String> js = sfs.compileToJsSrc(new SoyJsSrcOptions(), null);
        // return js.get(0);
    }

    public static void main(String[] args) {
        System.out.println(compile());
    }
}
