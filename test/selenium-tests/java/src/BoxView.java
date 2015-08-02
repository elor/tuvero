import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.w3c.css.sac.DescendantSelector;

import com.google.common.base.Function;

class BoxView implements TuveroTest {

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    WebDriver driver = runner.navigate("test/boxview.html");

    boolean success = false;

    /*
     * wait for auto-generated box to show
     */
    WebDriverWait wait = new WebDriverWait(driver, 1);
    try {
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return driver.findElements(By.className("boxview")).size() == 3;
        }
      });
      success = true;
    } catch (TimeoutException t) {
    }
    runner.ok(success, "Pageload");

    /*
     * find all boxes
     */
    List<WebElement> boxes = driver.findElements(By.className("boxview"));
    runner.equal(boxes.size(), 3, "there are three boxviews");

    final WebElement firstBox = boxes.get(0);
    final WebElement secondBox = boxes.get(1);
    final WebElement generatedBox = boxes.get(2);

    runner.ok(secondBox.getAttribute("class").contains("collapsed"),
        "second box is set to start collapsed");
    runner.ok(generatedBox.getAttribute("class").contains("generated"),
        "generated box if marked as being generated");

    final int collapsedHeight = 50;

    runner.ok(firstBox.getSize().height > collapsedHeight,
        "first box isn't collapsed");
    runner.ok(secondBox.getSize().height < collapsedHeight,
        "second box is collapsed");
    runner.ok(generatedBox.getSize().height > collapsedHeight,
        "generated box isn't collapsed");

    /*
     * click first box
     */
    firstBox.findElement(By.tagName("h3")).click();
    try {
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return firstBox.getSize().height < collapsedHeight;
        }
      });
    } catch (TimeoutException t) {
    }
    runner.ok(firstBox.getSize().height < collapsedHeight,
        "first box collapses on click");

    /*
     * click second box
     */
    secondBox.findElement(By.tagName("h3")).click();
    try {
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return secondBox.getSize().height > collapsedHeight;
        }
      });
    } catch (TimeoutException t) {
    }
    runner.ok(secondBox.getSize().height > collapsedHeight,
        "second box decollapses on click");

    /*
     * try to tab to a hidden input element
     */
    WebElement body = driver.findElement(By.tagName("body"));
    body.sendKeys(Keys.TAB);

    WebElement focused = driver.switchTo().activeElement();

    List<WebElement> firstBoxDescendants = firstBox.findElements(By
        .cssSelector("*"));
    List<WebElement> secondBoxDescendants = secondBox.findElements(By
        .cssSelector("*"));
    runner.notOk(firstBoxDescendants.contains(focused),
        "tab-focus doesn't enter collapsed element");
    runner.ok(secondBoxDescendants.contains(focused),
        "tab-focus enter first non-collapsed element");

    /*
     * click second box
     */
    secondBox.findElement(By.tagName("h3")).click();
    try {
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return secondBox.getSize().height < collapsedHeight;
        }
      });
    } catch (TimeoutException t) {
    }
    runner.ok(secondBox.getSize().height < collapsedHeight,
        "second box decollapses on click");
    focused = driver.switchTo().activeElement();
    runner.equal(focused, body,
        "focus of contained input elements is lost on collapsing");

  }
}
