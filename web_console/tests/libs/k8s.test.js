const assert = require('assert');
const path = require('path');
const { loadYaml } = require('../../utils/yaml');
const { readFileSync } = require('../../utils');
const KubernetesClient = require('../../libs/k8s');

const k8s = new KubernetesClient();
const testYaml = readFileSync(
  path.resolve(__dirname, '..', 'fixtures', 'test.yaml'),
  { encoding: 'utf-8' },
);

describe('Kubernetes Client', () => {
  describe('getBaseUrl', () => {
    it('should get prefixUrl', async () => {
      const baseUrl = await k8s.getBaseUrl();
      assert.equal(baseUrl, k8s.prefixUrl);
    });
  });

  describe('getNamespaces', () => {
    it('should get all namespaces', async () => {
      const { namespaces } = await k8s.getNamespaces();
      assert.ok(namespaces.items.find((x) => x.metadata.name === 'default'));
    });
  });

  describe('createFLApp', () => {
    it('should throw for none namespace, job_body', () => {
      assert.rejects(k8s.createFLApp());
    });

    it('should create default job for default', async () => {
      assert.doesNotReject(k8s.createFLApp('default', loadYaml(testYaml)));
    });
  });

  describe('getFLAppsByNamespace', () => {
    it('should get no apps for null namespace', async () => {
      const { flapps } = await k8s.getFLAppsByNamespace();
      assert.ok(flapps.items.length === 0);
    });

    it('should get all pods for default', async () => {
      const { flapps } = await k8s.getFLAppsByNamespace('default');
      assert.ok(Array.isArray(flapps.items));
    });
  });

  describe('getFLApp', () => {
    it('should throw for none namespace, name', () => {
      assert.rejects(k8s.getFLApp());
    });

    it('should get all pods for default', async () => {
      assert.doesNotReject(k8s.getFLApp('default', 'normal'));
    });
  });

  describe('getFLAppPods', () => {
    it('should throw for none namespace, name', () => {
      assert.rejects(k8s.getFLAppPods());
    });

    it('should get all pods for default', async () => {
      const { pods } = await k8s.getFLAppPods('default', 'normal');
      assert.ok(Array.isArray(pods.items));
    });
  });

  describe('deleteFLApp', () => {
    it('should throw for none namespace, name', () => {
      assert.rejects(k8s.deleteFLApp());
    });

    it('should delete test application for default', async () => {
      assert.doesNotReject(k8s.deleteFLApp('default', 'normal'));
    });
  });

  describe('getWebshellSession', () => {
    it('should throw for none namespace, name, container', () => {
      assert.rejects(k8s.getWebshellSession());
    });

    it('should get a session id', async () => {
      const res = await k8s.getWebshellSession('default', 'normal', 'example');
      assert.ok(typeof res.id === 'string');
    });
  });
});
