import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

class Index implements TuveroTest {

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    WebDriver driver = runner.navigate("index.html");

    runner.ok(true, "Pageload successful");

    /*
     * create a list of all app links for later query
     */
    Map<String, Boolean> apps = new HashMap<String, Boolean>();

    List<WebElement> links = driver.findElements(By.cssSelector("a.app"));
    for (WebElement link : links) {
      String href = link.getAttribute("href");
      if (href == null || href.length() == 0) {
        runner.ok(false, "unknown app link: " + link.getText());
      } else {
        String key = href.replaceAll("[#?].*$", "");
        apps.put(key, true);
      }
    }

    /*
     * find all build targets in the list of linked apps, using relative paths
     */
    String targets[] = { "boule", "tac", "test" };
    for (String target : targets) {
      String url = runner.getURL(target + "/index.html");
      runner.ok(apps.containsKey(url), target + " app is linked");
    }

    String remotes[] = { "http://fehler.tuvero.de/", "http://blog.tuvero.de/",
        "https://tuvero.de/dev/index.html", "https://tuvero.de/archive.html" };
    for (String remote : remotes) {
      runner.ok(apps.containsKey(remote), remote + " is linked");
    }
  }
}
