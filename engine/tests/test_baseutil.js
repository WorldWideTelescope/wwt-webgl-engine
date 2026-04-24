var assert = chai.assert;

describe("Base utilities", function() {

  it('should properly split strings by delimiter', function() {

    var items = [

      // Assorted general cases
      { input: "a,b;c", delimiters: [], expected: ["a,b;c"] },
      { input: "abc", delimiters: [","], expected: ["abc"] },
      { input: "a,b,c", delimiters: [","], expected: ["a", "b", "c"] },
      { input: "a,b;c|d", delimiters: [",", ";", "|"], expected: ["a", "b", "c", "d"] },
      { input: "a--b--c", delimiters: ["--"], expected: ["a", "b", "c"] },
      { input: "a-b-c", delimiters: ["--"], expected: ["a-b-c"] },
      { input: "a:b", delimiters: [":"], expected: ["a", "b"] },
      { input: "10h11m12s13'14", delimiters: ["h", "m", "s", "'"], expected: ["10", "11", "12", "13", "14"] },
    
      // Empty tokens
      { input: ",a", delimiters: [","], expected: ["a"] },
      { input: "a,", delimiters: [","], expected: ["a"] },
      { input: "a,,b", delimiters: [","], expected: ["a", "b"] },
      { input: ",,,", delimiters: [","], expected: [] },
      { input: "a,;|b", delimiters: [",", ";", "|"], expected: ["a", "b"] },
      { input: ",a,", delimiters: [","], expected: ["a"] },
    
      // Literal special chars
      { input: "a.b.c", delimiters: ["."], expected: ["a", "b", "c"] },
      { input: "a|b|c", delimiters: ["|"], expected: ["a", "b", "c"] },
      { input: "a(b)[c]", delimiters: ["(", ")", "[", "]"], expected: ["a", "b", "c"] },
    
      // Whitespace/newlines
      { input: "a b  c", delimiters: [" "], expected: ["a", "b", "c"] },
      { input: "a\nb\nc", delimiters: ["\n"], expected: ["a", "b", "c"] },
      { input: "a\r\nb\r\nc", delimiters: ["\r\n"], expected: ["a", "b", "c"] },
    
      // Mixed newline styles
      { input: "a\r\nb\nc", delimiters: ["\r\n", "\n"], expected: ["a", "b", "c"] },
      { input: "a\r\nb\nc", delimiters: ["\n", "\r\n"], expected: ["a", "b", "c"] },
    
      // Edge cases
      { input: "", delimiters: [","], expected: [] },
      { input: "abc", delimiters: ["abc"], expected: [] },
      { input: "a,b", delimiters: [",", ","], expected: ["a", "b"] },
      { input: "a,b", delimiters: ["", ","], expected: ["a", "b"] },
    
      // Precedence / overlap rules (longer delimiter wins)
      { input: "a--b", delimiters: ["-", "--"], expected: ["a", "b"] },
      { input: "a--b", delimiters: ["--", "-"], expected: ["a", "b"] },

      { input: "a::b", delimiters: [":", "::"], expected: ["a", "b"] },
      { input: "a::b", delimiters: ["::", ":"], expected: ["a", "b"] },
      { input: "a:::b", delimiters: [":", "::"], expected: ["a", "b"] },
      { input: "a:::b", delimiters: ["::", ":"], expected: ["a", "b"] },
    
      { input: "xabcY", delimiters: ["ab", "abc"], expected: ["x", "Y"] },
      { input: "xabcY", delimiters: ["abc", "ab"], expected: ["x", "Y"] },

      // Adjacent delimiters
      { input: "a--==b", delimiters: ["--", "=="], expected: ["a", "b"] },

      // Degree symbol
      { input: "a\u00b0", delimiters: ["\u00b0"], expected: ["a"] },
      { input: "a\u00b0bc,d\u00b0", delimiters: ["\u00b0", ","], expected: ["a", "bc", "d"] },
    ];

    for (let item of items) {
      assert.deepEqual(wwtlib.Util.splitString(item.input, item.delimiters), item.expected);
    }
  });

});
