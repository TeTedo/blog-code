package restdocs.springrestdocs.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/docs")
    public String viewDocs() {

        return "/docs/index.html";
    }
}
