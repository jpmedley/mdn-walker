# mdn-walker
Takes a csv file output by the [API Confluence](http://web-confluence.appspot.com/#!/) tool and produces a list of what's missing from MDN. This works becaue MDN URLs are regularized enough that URLs can be inferred from the names of interfaces and interface members. The tool constructs these inferred URLs and pings MDN. URLs that are not found are dumped into test file.

## Notes

The current implementation has a high number of false positives. The reason for this is because of the why MDN regularizes URLs. For example, the current script would turn a method such as `window.isFinite()` into `https://developer.mozilla.org/en-US/docs/Web/API/Window/isFinite`. In most cases, this straight forward conversion would be correct. Unfortunately, documentation for this method is actually located at `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite`. I haven't written code to correct this, but I am collecting false positives in [`redirects.med`](redirects.med).
