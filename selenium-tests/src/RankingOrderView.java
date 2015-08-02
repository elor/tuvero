import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

class RankingOrderView implements TuveroTest {

  private WebElement available;
  private WebElement selected;
  private WebElement output;
  private WebDriver driver;

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    driver = runner.navigate("test/rankingorderview.html");

    /*
     * init
     */
    List<WebElement> lists = driver.findElements(By.tagName("select"));
    available = lists.get(0);
    selected = lists.get(1);
    output = driver.findElement(By.id("outputlistview"));
    WebElement rightButton = driver.findElement(By.className("move-right"));
    WebElement leftButton = driver.findElement(By.className("move-left"));
    WebElement downButton = driver.findElement(By.className("move-down"));
    WebElement upButton = driver.findElement(By.className("move-up"));

    /*
     * wait for the list to initialize
     */
    runner.ok(waitForListInit(), "Pageload");

    /*
     * transfer a list element to the "selected"-list
     */
    Actions transferActions = new Actions(driver);
    String optionName = "Siege";
    transferActions.click(findListElement(available, optionName))
        .click(rightButton).build().perform();

    runner.equal(findListElement(available, optionName), null,
        "element is not in the available list anymore");
    runner.notEqual(findListElement(selected, optionName), null,
        "element is in the selected list");
    runner.equal(output.getText(), "wins", "output reflects the lists");

    leftButton.click();

    runner.notEqual(findListElement(available, optionName), null,
        "element is in the available list again");
    runner.equal(findListElement(selected, optionName), null,
        "element is in not the selected list anymore");
    runner.equal(output.getText(), "", "output reflects the lists");

    rightButton.click();
    runner.equal(readOutput(), "wins",
        "element has been returned to the selected-list");

    /*
     * transfer multiple
     */
    transferActions = new Actions(driver);
    transferActions.click(findListElement(available, "Feinbuchholz"))
        .keyDown(Keys.CONTROL).click(findListElement(available, "Buchholz"))
        .keyUp(Keys.CONTROL).click(rightButton).build().perform();
    runner.equal(readOutput(), "wins,buchholz,finebuchholz",
        "components are added to selection in order");

    /*
     * up/down buttons
     */
    transferActions = new Actions(driver);
    transferActions.click(findListElement(selected, "Feinbuchholz"))
        .click(upButton).build().perform();
    runner.equal(readOutput(), "wins,finebuchholz,buchholz",
        "up-button moves selection up");

    transferActions = new Actions(driver);
    transferActions.click(findListElement(selected, "Siege")).click(downButton)
        .build().perform();
    runner.equal(readOutput(), "finebuchholz,wins,buchholz",
        "down-button moves selection down");
  }

  private String readOutput() {
    List<WebElement> outputElements = output.findElements(By.cssSelector("*"));
    String components = "";
    for (WebElement component : outputElements) {
      components += "," + component.getText();
    }
    components = components.replaceFirst("^,", "");
    return components;
  }

  private WebElement findListElement(WebElement list, String partialText) {
    List<WebElement> allOptions = list.findElements(By.cssSelector("*"));
    WebElement searchedOption = null;

    for (WebElement option : allOptions) {
      if (option.isDisplayed() && !option.getCssValue("display").equals("none")
          && option.getText().contains(partialText)) {
        searchedOption = option;
        break;
      }
    }

    return searchedOption;
  }

  private boolean waitForListInit() {
    boolean success = false;
    try {
      WebDriverWait wait = new WebDriverWait(driver, 2);
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return available.findElements(By.cssSelector("*")).size() > 1;
        }
      });
      success = true;
    } catch (TimeoutException t) {
    }
    return success;
  }
}
