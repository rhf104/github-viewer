/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Ryan Heller-Fulscher
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

class HttpClient {

  get(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

}

class GithubViewerApp {

  constructor(httpClient) {
    this.httpClient = httpClient;
    this.userInput = document.getElementById('user');
    this.viewReposButton = document.getElementById('view');
    this.reposTable = document.getElementById('repos');
    this.statusText = document.getElementById('status');

    this.viewReposButton.addEventListener('click', () => this.getRepos());
  }

  displayRepos(repos) {
    let html = `
      <tr>
        <th>Repository Name
        <th>Repository URL
        <th>Owner Name
        <th>Owner Avatar
    `;
    repos.forEach(repo => {
      html += `
        <tr>
          <td>${repo.name}</td>
          <td><a href="${repo.html_url}">${repo.html_url}</a></td>
          <td>${repo.owner.login}</td>
          <td><img class="avatar" src="${repo.owner.avatar_url}"/></td>
        </tr>
      `;
    });
    this.statusText.innerText = '';
    this.reposTable.innerHTML = html;
  }

  getRepos() {
    const user = this.userInput.value;
    if (user) {
      const url = 'https://api.github.com/users/' + user + '/repos';
      this.httpClient.get(url)
        .then(data => this.displayRepos(JSON.parse(data)))
        .catch(error => {
          console.log(error);
          this.statusText.innerText = 'User not found';
        });
    }
  }

}

window.addEventListener('load', () => new GithubViewerApp(
  new HttpClient()
));