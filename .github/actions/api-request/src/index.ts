import * as core from '@actions/core';
import axios from 'axios';

const main = async () => {
  try {
    const token = core.getInput('token');
    const url = core.getInput('url');
    console.log(`Starting request to ${url}`);

    const response = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url,
      headers: { 'x-cron-secret-key': token },
    });

    const { data, status } = response;

    console.log(data);
    console.log(status);

    if (response.status === 200) {
      core.setOutput('success', true);
    } else {
      console.error('Request failed');
      core.setOutput('success', false);
    }
  } catch (error: any) {
    console.error('Request error');
    console.error(error);
    core.setFailed(error);
  }
};

main();
