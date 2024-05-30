import {
  loginWith,
  initTestBase,
  createBlog,
  user_t_k,
  user_p_r,
} from "./helper";
const { test, expect, describe, beforeEach } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await initTestBase(page, request);
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Please log in")).toBeVisible();
  });

  describe("Login...", () => {
    test("...succeeds with correct login", async ({ page }) => {
      await loginWith(page, user_t_k.username, user_t_k.password);
      await expect(page.getByText("Tee Kämänen logged in")).toBeVisible();
    });

    test("...fails with incorrect login", async ({ page }) => {
      await loginWith(page, user_t_k.username, "pahsword");
      await expect(page.getByText("Tee Kämänen logged in")).not.toBeVisible();
    });
  });

  describe("When logged in...", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user_t_k.username, user_t_k.password);
    });

    describe("...and a blog has been created...", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page);
      });

      test("...the created blog is found on the blog list", async ({
        page,
      }) => {
        await expect(page.getByText("aihe", { exact: true })).toBeVisible();
      });

      test("...the user can like the blog", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("0")).toBeVisible();
        await expect(page.getByText("1")).not.toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("0")).not.toBeVisible();
        await expect(page.getByText("1")).toBeVisible();
        await expect(page.getByText("2")).not.toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("1")).not.toBeVisible();
        await expect(page.getByText("2")).toBeVisible();
      });

      test("...the user can remove the blog created by the user", async ({
        page,
      }) => {
        await expect(page.getByText("aihe", { exact: true })).toBeVisible();
        await page.getByRole("button", { name: "view" }).click();
        await page.getByRole("button", { name: "remove" }).click();
        await expect(page.getByText("aihe", { exact: true })).not.toBeVisible();
      });

      test("...the user can see the remove button only on blogs created by the user", async ({
        page,
      }) => {
        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, user_p_r.username, user_p_r.password);
        await createBlog(page);
        await createBlog(page);
        await createBlog(page);
        const y = await page.getByRole("button", { name: "view" }).all();
        await y[0].click();
        await y[0].click();
        await y[0].click();
        await y[0].click();
        const z = await page.getByRole("button", { name: "remove" }).all();
        await expect(z.length === 3).toBe(true);
      });
    });

    test(`...and many blogs with different amounts of likes on them have been added, 
             after a fresh login,
             when the blogs are shown, 
             they are in order by the amount of likes,
             having the one with most likes being first
             `, async ({ page }) => {
      await createBlog(page);
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "close" }).click();
      await page.waitForTimeout(400);
      await createBlog(page);
      await page.getByRole("button", { name: "view" }).nth(1).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "close" }).click();
      await page.waitForTimeout(400);
      await createBlog(page);
      await page.getByRole("button", { name: "view" }).nth(2).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "like" }).click();
      await page.getByRole("button", { name: "close" }).click();
      await page.waitForTimeout(400);
      await page.getByRole("button", { name: "logout" }).click();
      await loginWith(page, user_t_k.username, user_t_k.password);
      await page.getByRole("button", { name: "view" }).first().click();
      await expect(page.getByText("8", { exact: false })).toBeVisible();
      await page.getByRole("button", { name: "close" }).click();
      await page.getByRole("button", { name: "view" }).nth(1).click();
      await expect(page.getByText("5", { exact: false })).toBeVisible();
      await page.getByRole("button", { name: "close" }).click();
      await page.getByRole("button", { name: "view" }).nth(2).click();
      await expect(page.getByText("2", { exact: false })).toBeVisible();
      await page.getByRole("button", { name: "close" }).click();
      await page.getByRole("button", { name: "view" }).first().click();
      await page.getByRole("button", { name: "view" }).first().click();
      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("showing final state", { exact: false })).not.toBeVisible();
    });
  });
});
