import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Vector;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.google.common.base.Function;

/**
 * @author Erik E. Lorenz
 */
public class TuveroTestRunner {
  /**
   * @param args
   *          command line arguments
   */
  public static void main(String[] args) {
    String browsers[] = { "firefox", "chrome" };
    int errors = 0;
    int successes = 0;

    Vector<String> statusLines = new Vector<String>();

    for (String browser : browsers) {
      System.out.println("");
      System.out.println("Browser: " + browser);

      String statusLine;

      try {
        TuveroTestRunner runner = new TuveroTestRunner(browser);
        try {
          runner.runTests();
        } catch (Throwable t) {
          System.out.println("ERROR while using TestRunner for " + browser);
          runner.errors++;
        }

        runner.finish();

        System.out.println("");
        int total = runner.errors + runner.successes;
        statusLine = runner.successes + " of " + total + " " + browser
            + " assertions passed, " + runner.errors + " failed.";

        errors += runner.errors;
        successes += runner.successes;
      } catch (Throwable t) {
        statusLine = "ERROR with TestRunner for " + browser;
        t.printStackTrace(System.out);
        errors++;
      }
      System.out.println(statusLine);
      statusLines.add(statusLine);
    }

    System.out.println("");
    System.out.println("Test Summmary");
    System.out.println("-------------");
    for (String status : statusLines) {
      System.out.println(status);
    }

    int total = errors + successes;
    System.out.println("");
    System.out.println(successes + " of " + total + " assertions passed, "
        + errors + " failed.");

    if (errors > 0) {
      System.exit(1);
    }
  }

  String browser;

  WebDriver driver;
  int errors = 0;

  int successes = 0;

  /**
   * @param browser
   *          the name of the browser to test
   */
  public TuveroTestRunner(String browser) {
    this.browser = browser;

    switch (browser) {
    case "chrome":
      try {
        System.setProperty("webdriver.chrome.driver", "lib/chromedriver.exe");
        driver = new ChromeDriver();
      } catch (IllegalStateException e) {
        System.setProperty("webdriver.chrome.driver", "lib/chromedriver");
        driver = new ChromeDriver();
      }
      break;
    case "firefox":
      driver = new FirefoxDriver();
      break;
    }

    if (driver == null) {
      throw new RuntimeException("Cannot load driver for " + this.browser);
    }
  }

  private void finish() {
    driver.close();
  }

  private void runTest(TuveroTest test) {
    String testName = test.getClass().getSimpleName();
    String prefix = browser + "_" + testName;

    System.out.println("Test: " + testName);

    driver.get("about:blank");
    try {
      test.run(this, prefix);
    } catch (WebDriverException we) {
      System.out.println("  ERROR: " + we.getClass().getSimpleName());
      errors++;
    }
    driver.get("about:blank");
  }

  WebDriver navigate(String relativeUrl) {
    String fileURL = getURL(relativeUrl);
    driver.get(fileURL);

    WebDriverWait wait = new WebDriverWait(driver, 1);
    wait.until(new Function<WebDriver, WebDriver>() {
      @Override
      public WebDriver apply(WebDriver driver) {
        JavascriptExecutor jsExec = (JavascriptExecutor) driver;
        if (jsExec.executeScript("return document.readyState").equals(
            "complete")) {
          return driver;
        }
        return null;
      }
    });

    return driver;
  }

  String getURL(String relativeUrl) {
    String workdir = System.getProperty("user.dir");
    File url = new File(workdir + "../../../../" + relativeUrl);
    String absolutePath;
    try {
      absolutePath = url.getCanonicalPath();
    } catch (IOException e) {
      absolutePath = url.getAbsolutePath();
    }

    String fileURL = "file://" + absolutePath;
    return fileURL;
  }

  private void runTests() {
    if (TuveroTestList.tests.length == 0) {
      System.out.println("ERROR: no tests available");
      errors++;
    }

    for (TuveroTest test : TuveroTestList.tests) {
      runTest(test);
    }
  }

  public void ok(boolean result, String message) {
    if (result) {
      System.out.println(" OK: " + message);
      successes++;
    } else {
      System.out.println(" FAIL: " + message);
      System.out.println("  expected: " + true);
      System.out.println("  result: " + result);
      errors++;
    }
  }

  public void notOk(boolean result, String message) {
    if (!result) {
      System.out.println(" OK: " + message);
      successes++;
    } else {
      System.out.println(" FAIL: " + message);
      System.out.println("  expected: " + false);
      System.out.println("  result: " + result);
      errors++;
    }
  }

  public void equal(String result, String expectation, String message) {
    if (result.equals(expectation)) {
      System.out.println(" OK: " + message);
      successes++;
    } else {
      System.out.println(" FAIL: " + message);
      System.out.println("  expected: " + expectation);
      System.out.println("  result: " + result);
      errors++;
    }
  }

  public void notEqual(String result, String expectation, String message) {
    if (result.equals(expectation)) {
      System.out.println(" FAIL: " + message);
      System.out.println("  result (not expected): " + expectation);
      errors++;
    } else {
      System.out.println(" OK: " + message);
      successes++;
    }
  }

  boolean screenshot(String outputFilename) {
    File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
    FileInputStream inputStream;
    FileOutputStream outputStream;

    System.out.print(" screenshot " + outputFilename + " ... ");
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
      System.out.println("Done.");
    } catch (FileNotFoundException e) {
      System.out.println("ERROR. File not found.");
      return false;
    } catch (IOException e) {
      System.out.println("ERROR. IOException");
      return false;
    }

    return true;
  }
}
