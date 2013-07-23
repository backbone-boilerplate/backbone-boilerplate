describe "one tautology", () ->
  it "is a tautology", () ->
    expect(true).toBeTruthy()

  describe "is awesome", () ->
    it "is awesome", () ->
      expect(1).toBe(1)

describe "simple tests", () ->
  it "increments", () ->
    mike = 0
    expect(mike++ is 0).toBeTruthy()
    expect(mike is 1).toBeTruthy()

  it "increments (improved)", () ->
    mike = 0
    expect(mike++).toBe(0)
    expect(mike).toBe(1)

describe "setUp/tearDown", () ->
  beforeEach () ->
    # console.log("Before")

  afterEach () ->
    # console.log("After")

  it "example", () ->
    # console.log("During")

  describe "setUp/tearDown", () ->
    beforeEach () ->
      # console.log("Before2")

    afterEach () ->
      # console.log("After2")

    it "example", () ->
      # console.log("During Nested")

describe "async", () ->
  it "multiple async", () ->
    semaphore = 2

    setTimeout () ->
      expect(true).toBeTruthy()
      semaphore--
    , 500

    setTimeout () ->
      expect(true).toBeTruthy()
      semaphore--
    , 500

    waitsFor () -> return semaphore is 0
