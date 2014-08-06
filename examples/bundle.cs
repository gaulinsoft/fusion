using System.Web.Optimization;
using Gaulinsoft.Web.Fusion;
using Gaulinsoft.Web.Optimization;

public class BundleConfig
{
    public static void RegisterBundles(BundleCollection bundles)
    {
        // Create the fusion bundle and add it to the bundles collection
        bundles.Add(new FusionBundle("~/js/bundle.js").Include
        (
            "~/Scripts/file1.fjs",
            "~/Scripts/file2.fjs",
            "~/Scripts/file3.fjs"
        ));
    }
}