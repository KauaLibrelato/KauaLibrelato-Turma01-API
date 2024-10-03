import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';

describe('Company API', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  let companyId;
  let employeeId;
  let productId;
  let serviceId;

  p.request.setDefaultTimeout(30000);

  beforeAll(async () => {
    p.reporter.add(rep);
  });
  afterAll(() => p.reporter.end());

  it('create company', async () => {
    const response = (
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: faker.company.name(),
          cnpj: '12345678912345',
          state: 'Santa Catarina',
          city: 'Criciuma',
          address: 'Rua Jairo Nunes',
          sector: 'Tecnologia'
        })
        .expectStatus(StatusCodes.CREATED)
    ).body.id;
    companyId = response;
  });

  it('get companies', async () => {
    await p.spec().get(`${baseUrl}/company`).expectStatus(StatusCodes.OK);
  });

  it("get company's by id", async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK);
  });

  it("create company's product", async () => {
    const response = (
      await p
        .spec()
        .post(`${baseUrl}/company/${companyId}/products`)
        .withJson({
          productName: faker.commerce.productName(),
          price: 100,
          productDescription: faker.commerce.productDescription()
        })
        .expectStatus(StatusCodes.CREATED)
    ).body.productId;
    productId = response;
  });

  it('get all company products', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/products`)
      .expectStatus(StatusCodes.OK);
  });

  it('not get company products by id, because productId it does not exist', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/products/${100}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('post employee to company', async () => {
    const response = (
      await p
        .spec()
        .post(`${baseUrl}/company/${companyId}/employees`)
        .withJson({
          name: faker.person.fullName(),
          position: 'CEO',
          email: faker.internet.email()
        })
    ).body.employees;
    employeeId = response.employeeId;
  });

  it('get company employees', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/employees`)
      .expectStatus(StatusCodes.OK);
  });

  it("get company's employee by id", async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/employees/${employeeId}`)
      .expectStatus(StatusCodes.OK);
  });

  it("post company's services", async () => {
    const response = (
      await p
        .spec()
        .post(`${baseUrl}/company/${companyId}/services`)
        .withJson({
          serviceName: faker.person.fullName(),
          serviceDescription: faker.commerce.productDescription()
        })
        .expectStatus(StatusCodes.CREATED)
    ).body.services;
    serviceId = response.serviceId;
  });

  it("get company's services by id", async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/services/${serviceId}`)
      .expectStatus(StatusCodes.OK);
  });
  it("delete company's service by id", async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}/services/${serviceId}`);
  });

  it("delete employee's company by id", async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}/employees/${employeeId}`)
      .expectStatus(StatusCodes.OK);
  });

  it("not delete company's product by id not found", async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}/products/${100}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });
  it('delete company by id', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK);
  });
});
