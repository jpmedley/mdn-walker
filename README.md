# mdn-walker
Takes a csv file output by the [API Confluence](http://web-confluence.appspot.com/#!/) tool and produces a list of what's missing from MDN. This works becaue MDN URLs are regularized enough that URLs can be inferred from the names of interfaces and interface members. The csv file is constructed through the Confluence interace by configuring the catalog to show two successive versions of the same browser. The output csv file contains lines like the following:

    Footgun,load(),false,true
    
When the script finds lines like these, it constructs a URL like:

    https://developer.mozilla.org/en-US/docs/Web/API/Footgun/load

The tool pings this URL. If it's not found, it's dumped into a text file.

## Notes

The current implementation has a high number of false positives. The reason for this is because of how MDN regularizes URLs. For example, the current script would turn a method such as `window.isFinite()` into `https://developer.mozilla.org/en-US/docs/Web/API/Window/isFinite`. In most cases, this straight forward conversion would be correct. Unfortunately, documentation for this method is located at `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite`. I haven't written code to correct this, but I am collecting false positives in [`redirects.med`](redirects.med).

Keeps erring with 'Request path contains unescaped characters'. With 6000 lines in the input file, need to implement verbose output to learn which API has the wrong characters.
