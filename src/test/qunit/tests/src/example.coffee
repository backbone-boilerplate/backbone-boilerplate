test "one tautology", () ->
  ok(true)

module("simple tests")

test "increments", () ->
  mike = 0
  ok(mike++ is 0)
  ok(mike is 1)

test "increments (improved)", () ->
  mike = 0
  equal(mike++, 0)
  equal(mike, 1)

module "setUp/tearDown",
  setup: () ->
    #console.log("Before")

  teardown: () ->
    #console.log("After")

test "example", () ->
  #console.log("During")

module "async"

test "multiple async", () ->
  expect(2)

  stop()

  setTimeout () ->
    ok true, "async operation completed"
    start()
  , 500

  stop()

  setTimeout () ->
    ok true, "async operation completed"
    start()
  , 500
