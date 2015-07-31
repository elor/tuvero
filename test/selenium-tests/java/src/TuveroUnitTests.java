import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class TuveroUnitTests {
  public static void main(String[] args) {
    unitTestTuvero(new ChromeDriver(), "chrome");
    unitTestTuvero(new FirefoxDriver(), "firefox");
  }

  private static void unitTestTuvero(WebDriver driver, String name) {
    System.out.println("testing " + name);
    driver.get("https://tuvero.de/dev/test/unittest.html");

    WebDriverWait wait = new WebDriverWait(driver, 5);
    WebElement testresultElement = wait.until(ExpectedConditions
        .visibilityOfElementLocated(By.id("qunit-testresult")));

    String numfailed = testresultElement.findElement(By.className("failed"))
        .getText();
    String numtotal = testresultElement.findElement(By.className("total"))
        .getText();

    System.out.println(numfailed + " failed of " + numtotal + " total events");

    WebElement checkbox = driver.findElement(By.id("qunit-filter-pass"));
    checkbox.click();

    wait.until(ExpectedConditions.presenceOfElementLocated(By
        .className("hidepass")));

    takeScreenshot(driver, "qunit-" + name + ".png");

    driver.quit();
  }

  private static void takeScreenshot(WebDriver driver, String outputFilename) {
    try {
      Thread.sleep(100);
    } catch (InterruptedException e1) {
    }

    File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
    FileInputStream inputStream;
    FileOutputStream outputStream;
    try {
      inputStream = new FileInputStream(scrFile);
      outputStream = new FileOutputStream(new File(outputFilename));

      int lengthStream;
      byte[] buff = new byte[1024 * 1024];

      while ((lengthStream = inputStream.read(buff)) > 0) {
        outputStream.write(buff, 0, lengthStream);
      }

      outputStream.close();
      inputStream.close();
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
