import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

class CheckBoxView implements TuveroTest {

  private WebElement value;
  private WebElement checkbox;
  private WebElement falseButton;
  private WebElement trueButton;
  private WebDriver driver;
  private WebElement checkboxspan;

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    driver = runner.navigate("test/checkboxview.html");

    value = driver.findElement(By.className("checkboxvalue"));
    checkbox = driver.findElement(By.tagName("input"));
    checkboxspan = driver.findElement(By.className("checkboxspan"));
    List<WebElement> buttons = driver.findElements(By.tagName("button"));
    falseButton = buttons.get(0);
    trueButton = buttons.get(1);

    runner.equal(falseButton.getText(), "false", "'false' button queried");
    runner.equal(trueButton.getText(), "true", "'true' button queried");

    /*
     * wait for the initial value to show
     */
    runner.ok(waitForValue(true), "Pageload");

    /*
     * click the checkbox and its surrounding span
     */
    checkbox.click();
    runner.ok(waitForValue(false), "checkbox click changes the value");
    runner.equal(checked(), false, "checkbox is unchecked");

    checkbox.click();
    runner.ok(waitForValue(true), "checkbox click changes the value again");
    runner.equal(checked(), true, "checkbox is re-checked");

    checkboxspan.click();
    runner.ok(waitForValue(false), "checkbox-span click changes the value");
    runner.equal(checked(), false, "checkbox is unchecked");

    checkboxspan.click();
    runner.ok(waitForValue(true), "checkbox-span click reverts the change");
    runner.equal(checked(), true, "checkbox is re-checked");

    /*
     * true/false button clicks (i.e. setting the background state directly)
     */
    falseButton.click();
    runner.ok(waitForValue(false), "false-button click changes the value");
    runner.equal(checked(), false, "checkbox is unchecked");

    falseButton.click();
    runner.sleepMilliSeconds(100);
    runner.equal(getValue(), false,
        "false-button doesn't change the value to true on second click");

    trueButton.click();
    runner.ok(waitForValue(true), "true-button click changes the value");
    runner.equal(checked(), true, "checkbox is unchecked");

    trueButton.click();
    runner.sleepMilliSeconds(100);
    runner.equal(getValue(), true,
        "true-button doesn't change the value to false on second click");
  }

  private boolean getValue() {
    return value.getText().equals("true");
  }

  private boolean checked() {
    return checkbox.isSelected();
  }

  private boolean waitForValue(boolean expected) {
    boolean success = false;
    WebDriverWait wait = new WebDriverWait(driver, 1);
    try {
      wait.until(ExpectedConditions.textToBePresentInElement(value, ""
          + expected));
      success = true;
    } catch (TimeoutException t) {
    }
    return success;
  }
}