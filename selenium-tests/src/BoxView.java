import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

class BoxView implements TuveroTest {

  final static private int collapsedHeight = 50;

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

    runner.notOk(isCollapsed(firstBox), "first box isn't collapsed");
    runner.ok(isCollapsed(secondBox), "second box is collapsed");
    runner.notOk(isCollapsed(generatedBox), "generated box isn't collapsed");

    /*
     * collapse first box
     */
    toggleCollapse(driver, firstBox);
    runner.ok(isCollapsed(firstBox), "first box collapses on click");

    /*
     * expand second box
     */
    toggleCollapse(driver, secondBox);
    runner.notOk(isCollapsed(secondBox), "second box expands on click");

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
     * focus-loss on box collapse
     */
    toggleCollapse(driver, secondBox);
    runner.ok(isCollapsed(secondBox), "second box collapses while focused");
    focused = driver.switchTo().activeElement();
    runner.equal(focused, body,
        "focus of contained input elements is lost on collapsing");

    /*
     * boxes auto-grow with their content
     */
    int generatedBoxHeight = generatedBox.getSize().height;
    try {
      wait.until(new AutoGrowthCondition(generatedBox));
    } catch (TimeoutException t) {
    }
    runner.ok(generatedBox.getSize().height > generatedBoxHeight,
        "boxes grow with their content");

    /*
     * collapse generated box
     */
    toggleCollapse(driver, generatedBox);
    runner.ok(isCollapsed(generatedBox), "generated box collapses on click");

    /*
     * expand generated box again
     */
    toggleCollapse(driver, generatedBox);
    runner.notOk(isCollapsed(generatedBox), "generated box expands on click");

    /*
     * see if the generated box still grows
     */
    generatedBoxHeight = generatedBox.getSize().height;
    try {
      wait.until(new AutoGrowthCondition(generatedBox));
    } catch (TimeoutException t) {
    }
    runner.ok(generatedBox.getSize().height > generatedBoxHeight,
        "boxes grow with their content");
  }

  private boolean isCollapsed(final WebElement box) {
    return box.getSize().height < collapsedHeight;
  }

  private void toggleCollapse(WebDriver driver, final WebElement box) {
    boolean isCurrentlyCollapsed = isCollapsed(box);
    box.findElement(By.tagName("h3")).click();
    WebDriverWait wait = new WebDriverWait(driver, 1);
    try {
      wait.until(new CollapsedCondition(box, !isCurrentlyCollapsed));
    } catch (TimeoutException t) {
    }
  }

  private final class AutoGrowthCondition implements
      Function<WebDriver, Boolean> {
    private final int generatedBoxHeight;
    private final WebElement generatedBox;

    private AutoGrowthCondition(WebElement generatedBox) {
      this.generatedBoxHeight = generatedBox.getSize().height;
      this.generatedBox = generatedBox;
    }

    @Override
    public Boolean apply(WebDriver arg0) {
      return generatedBox.getSize().height > generatedBoxHeight;
    }
  }

  class CollapsedCondition implements Function<WebDriver, Boolean> {
    private WebElement box;
    private boolean shouldBeCollapsed;

    public CollapsedCondition(WebElement boxView, boolean shouldBeCollapsed) {
      this.box = boxView;
      this.shouldBeCollapsed = shouldBeCollapsed;
    }

    @Override
    public Boolean apply(WebDriver driver) {
      return isCollapsed(box) == shouldBeCollapsed;
    }
  }
}
