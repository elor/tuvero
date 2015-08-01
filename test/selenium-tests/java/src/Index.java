import org.openqa.selenium.WebDriver;

class Index implements TuveroTest {

  @Override
  public void run(TuveroTestRunner runner, String prefix) {
    WebDriver driver = runner.navigate("index.html");

    runner.ok(true, "Pageload successful");

    // TODO perform other tests?

  }
}
