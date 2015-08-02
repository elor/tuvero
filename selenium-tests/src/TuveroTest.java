/**
 * A single test to be run within a browser
 * 
 * @author Erik E. Lorenz
 */
public interface TuveroTest {
  /**
   * @param runner
   *          a runner instance, which can be used for value comparisons and
   *          stuff
   * @param prefix
   *          the prefix of the current test. Useful for screenshot prefixing
   */
  public void run(TuveroTestRunner runner, String prefix);
}
