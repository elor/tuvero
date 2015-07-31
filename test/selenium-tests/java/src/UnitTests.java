import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

class UnitTests implements TuveroTest {

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    WebDriver driver = runner.navigate("test/unittest.html");

    WebDriverWait wait = new WebDriverWait(driver, 5);
    WebElement testresultElement = wait.until(ExpectedConditions
        .visibilityOfElementLocated(By.id("qunit-testresult")));

    String numfailed = testresultElement.findElement(By.className("failed"))
        .getText();
    String numtotal = testresultElement.findElement(By.className("total"))
        .getText();

    runner.equal(numfailed, "0", "all unit tests succeeded");
    runner.notEqual(numtotal, "0", numtotal + " unit tests have been run");

    WebElement checkbox = driver.findElement(By.id("qunit-filter-pass"));
    checkbox.click();

    wait.until(ExpectedConditions.presenceOfElementLocated(By
        .className("hidepass")));

    runner.ok(runner.takeScreenshot(prefix + "-qunit.png"), prefix
        + "-qunit.png screenshot");
  }
}
