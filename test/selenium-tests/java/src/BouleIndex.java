import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

class BouleIndex implements TuveroTest {

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    WebDriver driver = runner.navigate("boule/index.html");

    WebDriverWait wait = new WebDriverWait(driver, 2);
    boolean splashInvisible = false;
    try {
      splashInvisible = wait.until(ExpectedConditions
          .invisibilityOfElementLocated(By.id("splash")));
    } catch (TimeoutException t) {
    }
    runner.ok(splashInvisible, "Pageload");

    // TODO perform other tests?

  }
}
