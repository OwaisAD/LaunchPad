import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../setup/setup";
import { createDummyUser, createGenericDummyUser, createOrganizationForUser } from "../setup/createDummyUser";

describe("Integration Tests - Organizations", () => {
  it("should create an organization", async () => {
    await createDummyUser();

    const res = await request(app).post("/organizations").send({
      name: "My Org",
      description: "Testing org",
      website: "https://example.com",
      location: "Copenhagen",
    });

    expect(res.status).toBe(201);
    expect(res.body.organization).toMatchObject({
      name: "My Org",
      description: "Testing org",
      website: "https://example.com",
    });
  });

  it("should invite a user to an organization", async () => {
    const adminUser = await createDummyUser();
    const dummyUser2 = await createGenericDummyUser();

    const org = await createOrganizationForUser(adminUser.id);

    const res = await request(app).post(`/organizations/${org.id}/invite`).send({
      email: dummyUser2.email,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User added to organization successfully");
  });

  it("should get an organization by slug", async () => {
    const user = await createDummyUser();
    const dummyOrg = await createOrganizationForUser(user.id);

    const res = await request(app).get(`/organizations/${dummyOrg.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.organization).toHaveProperty("slug", dummyOrg.slug);
  });
});
