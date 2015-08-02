import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

class TabMenuView implements TuveroTest {

  private WebDriver driver;
  private WebElement menu;
  private Map<String, WebElement> links;
  private WebElement tabContainer;
  private List<WebElement> tabs;

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    driver = runner.navigate("test/tabmenuview.html");

    /*
     * initialization
     */
    runner.ok(waitForMenuInit(), "Pageload");

    menu = driver.findElement(By.className("tabmenu"));
    links = findLinks();
    tabContainer = driver.findElement(By.id("tabs"));
    tabs = tabContainer.findElements(By.xpath("*"));

    /*
     * default tab: #home
     */
    runner.equal(getURLHash(), "", "no initial url hash");
    runner.equal(getOpenTabName(), "home", "home tab is open initially");

    /*
     * re-opening current tab only sets the hash
     */
    links.get("home").click();
    runner.equal(getURLHash(), "home", "#home clicked");
    runner.equal(getOpenTabName(), "home", "home tab is still open");

    /*
     * transitioning to another tab via tabmenu
     */
    links.get("games").click();
    runner.equal(getURLHash(), "games", "#games clicked");
    runner.equal(getOpenTabName(), "games", "games tab has opened");

    /*
     * open a tab by re-navigating, but without pageload (hopefully)
     */
    runner.navigate("#teams");
    runner.equal(getURLHash(), "teams", "hash-navigation changed the URL hash");
    runner.equal(getOpenTabName(), "teams", "teams tab has opened");

    /*
     * open a forbidden tab
     */
    links.get("deleteteam").click();
    runner.equal(getURLHash(), "deleteteam",
        "forbidden tab still causes a hash change");
    runner.notEqual(getOpenTabName(), "deleteteam",
        "forbidden tab doesn't open");

    /*
     * open a hidden tab
     */
    runner.navigate("#debug");
    runner.equal(getURLHash(), "debug", "hash changed to hidden tab");
    runner.equal(getOpenTabName(), "debug", "hidden tab opened");

    /*
     * try to open an unknown tab
     */
    runner.navigate("#invalid");
    runner.equal(getURLHash(), "invalid",
        "hash changed, although tab is unknown");
    runner.equal(getOpenTabName(), "debug", "previous tab stays open");
    
    /*
     * open the periodically hidden tab
     */
    WebDriverWait wait = new WebDriverWait(driver, 5);
    wait.until(ExpectedConditions.visibilityOfElementLocated(By
        .cssSelector(".tabmenu a[href=\"#HTML5_Logo_128\"]")));

    driver.findElement(By.cssSelector(".tabmenu a[href=\"#HTML5_Logo_128\"]"))
        .click();
    runner.equal(getURLHash(), "HTML5_Logo_128", "url is used");
    runner.equal(getOpenTabName(), "HTML5_Logo_128", "tab is open");

    wait.until(ExpectedConditions.invisibilityOfElementLocated(By
        .cssSelector(".tabmenu a[href=\"#HTML5_Logo_128\"]")));

    runner.equal(getOpenTabName(), "home",
        "opening default tab on permission change");
  }

  private String getOpenTabName() {
    String openTab = "";
    for (WebElement tab : tabs) {
      if (tab.isDisplayed() && tab.getAttribute("class").equals("open")
          && !tab.getCssValue("display").equals("none")) {
        openTab += tab.getAttribute("data-tab") + ",";
      }
    }
    return openTab.replaceAll(",$", "");
  }

  private Map<String, WebElement> findLinks() {
    List<WebElement> tablinks = menu.findElements(By.tagName("a"));
    Map<String, WebElement> linkMap = new HashMap<>();

    for (WebElement link : tablinks) {
      linkMap.put(link.getAttribute("href").replaceFirst("^.*#", ""), link);
    }

    return linkMap;
  }

  private String getURLHash() {
    String url = driver.getCurrentUrl();
    String hash = url.replaceAll(".*(#.*)", "$1").replaceFirst("^#", "");
    if (hash.equals(url)) {
      return "";
    }
    return hash;
  }

  private boolean waitForMenuInit() {
    boolean success = false;
    try {
      WebDriverWait wait = new WebDriverWait(driver, 2);
      wait.until(ExpectedConditions.visibilityOfElementLocated(By
          .className("tabmenu")));
      success = true;
    } catch (TimeoutException t) {
    }
    return success;
  }
}
