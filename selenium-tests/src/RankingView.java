import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

class RankingView implements TuveroTest {

  private WebDriver driver;
  private WebElement table;

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    driver = runner.navigate("test/rankingview.html");

    table = driver.findElement(By.className("rankingview"));

    runner.ok(waitForTableInit(), "Pageload");

    runner.equal(table.findElements(By.tagName("tr")).size(), 65,
        "ranking table contains 64 teams");
    List<WebElement> headers = table.findElements(By.tagName("th"));
    runner.ok(headers.size() >= 8, "enough columns");

    ArrayList<String> headerTexts = new ArrayList<String>();
    do {
      try {
        for (WebElement header : table.findElements(By.tagName("th"))) {
          headerTexts.add(header.getText());
        }
      } catch (StaleElementReferenceException e) {
        headerTexts = new ArrayList<String>();
      }
    } while (headerTexts.size() == 0);

    runner.ok(headerTexts.contains("No."), "table has a 'No.' row");
    runner.ok(headerTexts.contains("Name"), "table has a 'Name' row");
    runner.ok(headerTexts.contains("wins"), "table has a 'wins' row");
    runner.ok(headerTexts.contains("buchholz"), "table has a 'buchholz' row");
    runner.ok(headerTexts.contains("finebuchholz"),
        "table has a 'finebuchholz' row");
    runner.ok(headerTexts.contains("sonneborn"), "table has a 'sonneborn' row");
    runner.ok(headerTexts.contains("saldo"), "table has a 'saldo' row");
    runner.ok(headerTexts.contains("points"), "table has a 'points' row");
  }

  private boolean waitForTableInit() {
    boolean success = false;
    try {
      WebDriverWait wait = new WebDriverWait(driver, 2);
      wait.until(new Function<WebDriver, Boolean>() {
        @Override
        public Boolean apply(WebDriver driver) {
          return table.findElements(By.cssSelector("tr")).size() > 2;
        }
      });
      success = true;
    } catch (TimeoutException t) {
    }
    return success;
  }
}
