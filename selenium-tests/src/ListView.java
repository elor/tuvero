import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

class ListView implements TuveroTest {

  private WebElement hoverindex;

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    WebDriver driver = runner.navigate("test/listview.html");

    final WebElement ul = driver.findElement(By.tagName("ul"));
    WebElement ol = driver.findElement(By.tagName("ol"));
    WebElement div = driver.findElement(By.tagName("div"));
    WebElement tr = driver.findElement(By.tagName("tr"));
    hoverindex = driver.findElement(By.id("hoverid"));

    boolean success = waitForListInit(driver, ul);

    runner.ok(success, "Pageload");

    runner.equal(getChildren(ul).size(), 10, "unordered list has 10 children");
    runner.equal(getChildren(ol).size(), 10, "ordered list has 10 children");
    runner.equal(getChildren(div).size(), 10, "div/span has 10 children");
    runner.equal(getChildren(tr).size(), 10, "table row has 10 children");

    List<WebElement> tds = getChildren(tr);

    for (int i = 0; i < tds.size(); i += 1) {
      Actions action = new Actions(driver);
      action.moveToElement(tds.get(i)).build().perform();
      runner.equal(readHoverIndex(), i, "selecting mouseover id " + i);
    }

    Actions invalidHoverAction = new Actions(driver);
    invalidHoverAction.moveToElement(div.findElement(By.cssSelector("*")))
        .build().perform();
    runner.equal(readHoverIndex(), -1,
        "mouseover id resets on another list's target");

    tds.get(7).click();
    tds.get(3).click();

    runner.equal(getChildren(ul).size(), 8, "unordered list has 8 children");
    runner.equal(getChildren(ol).size(), 8, "ordered list has 8 children");
    runner.equal(getChildren(div).size(), 8, "div/span has 8 children");
    runner.equal(getChildren(tr).size(), 8, "table row has 8 children");

    int actualValue = 0;
    tds = getChildren(tr);
    for (int i = 0; i < tds.size(); i += 1) {
      if (actualValue == 3 || actualValue == 7) {
        actualValue++;
      }

      Actions action = new Actions(driver);
      action.moveToElement(tds.get(i)).build().perform();
      int hoverid = readHoverIndex();
      runner.equal(hoverid, i, "post-deletion id " + i + " => " + actualValue);

      actualValue++;
    }

  }

  private Integer readHoverIndex() {
    return Integer.decode(hoverindex.getText());
  }

  private boolean waitForListInit(WebDriver driver, final WebElement ul) {
    boolean success = false;
    WebDriverWait wait = new WebDriverWait(driver, 2);
    try {
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return !getChildren(ul).isEmpty();
        }
      });
      success = true;
    } catch (TimeoutException t) {
    }
    return success;
  }

  private List<WebElement> getChildren(WebElement list) {
    return list.findElements(By.cssSelector("*"));
  }
}
