webpackJsonp([39859872668372],{811:function(e,t){e.exports={data:{post:{id:"/home/fisctf/blog/content/posts/2016-03-03--obfuscating-python/index.md absPath of file >>> MarkdownRemark",html:'<h3>Intro</h3>\n<p>I got to thinking, you can obfuscate js and vbs when serving up code to people, why not Python? Well to there is that whole whitespace thing and lack of semi-colons, but lets see what we can do. </p>\n<hr>\n<blockquote>\n<p>Obfuscation: <em>“To make so confused or opaque as to be difficult to perceive or understand”</em></p>\n</blockquote>\n<p>In terms of programming one usually doesnt purposefully obfuscate their code as they may wish for others to read it. However within the realm of Cyber Security the opposite often holds true. Many of those who are crafting the code behind malware (or for fun in puzzles/competitions like IOCCC) purposefully make their code as difficult to read as possible using obfuscation. Therefore it is relatively important to understand obfuscation when it comes to code analysis.</p>\n<p>Here we will be going through the process of applying basic obfuscation to python code in the below examples.</p>\n<hr>\n<h3>Our initial code</h3>\n<p>Scanner.py is a simple scapy implementation of an arp scan for a local area network. An attacker may find it useful to find all live hosts on a network so they may find potential pivots. However most attackers would probably use something a little more sophisticated in order to remain undetected but for our purposes this will work.</p>\n<div class="gatsby-highlight" data-language="python">\n      <pre class="language-python"><code class="language-python"><span class="token comment">#!/usr/bin/env python</span>\n \n<span class="token keyword">from</span> scapy<span class="token punctuation">.</span><span class="token builtin">all</span> <span class="token keyword">import</span> <span class="token operator">*</span>\n \n<span class="token keyword">try</span><span class="token punctuation">:</span>\n    alive<span class="token punctuation">,</span>dead<span class="token operator">=</span>srp<span class="token punctuation">(</span>Ether<span class="token punctuation">(</span>dst<span class="token operator">=</span><span class="token string">"ff:ff:ff:ff:ff:ff"</span><span class="token punctuation">)</span><span class="token operator">/</span>ARP<span class="token punctuation">(</span>pdst<span class="token operator">=</span><span class="token string">\'192.168.1.0/24\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span> timeout<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">,</span> verbose<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">)</span>\n    <span class="token keyword">print</span> <span class="token string">"MAC - IP"</span>\n    <span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span><span class="token builtin">len</span><span class="token punctuation">(</span>alive<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n            <span class="token keyword">print</span> alive<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>hwsrc <span class="token operator">+</span> <span class="token string">" - "</span> <span class="token operator">+</span> alive<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>psrc\n<span class="token keyword">except</span><span class="token punctuation">:</span>\n    <span class="token keyword">pass</span></code></pre>\n      </div>\n<p>Here is sample output from Scanner.py. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$ sudo python scanner.py \n[sudo] password for user: \nWARNING: No route found for IPv6 destination :: (no default route?)\nMAC - IP\n00:00:11:11:11:11 - 192.168.1.10\ncc:bb:44:33:22:11 - 192.168.1.1\ndd:ee:ae:45:67:34 - 192.168.1.14\nff:dd:78:ad:6d:23 - 192.168.1.4\n00:00:00:70:07:e2 - 192.168.1.30\n00:00:11:22:22:22 - 192.168.1.27</code></pre>\n      </div>\n<p>Base64 is a common type of encoding that is easy to encode and decode using the python Base64 module. It adds a layer of obfuscation between prying eyes and our code. So the first step we will take will be to encode Scanner.py in Base64. The below code snippet will call the base64 library and encode Scanner.py, then dump it as a single string into output.o</p>\n<div class="gatsby-highlight" data-language="python">\n      <pre class="language-python"><code class="language-python"><span class="token keyword">import</span> base64 \n<span class="token comment">#Its all pretty self explanatory</span>\n<span class="token keyword">def</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>\n\n    target<span class="token operator">=</span><span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"scanner.py"</span><span class="token punctuation">,</span> <span class="token string">"r"</span><span class="token punctuation">)</span>\n    todo <span class="token operator">=</span> target<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>\n    target<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n    s<span class="token operator">=</span>base64<span class="token punctuation">.</span>b64encode<span class="token punctuation">(</span>todo<span class="token punctuation">)</span>\n    target <span class="token operator">=</span> <span class="token builtin">open</span><span class="token punctuation">(</span><span class="token string">"output.o"</span><span class="token punctuation">,</span> <span class="token string">"w"</span><span class="token punctuation">)</span>\n    target<span class="token punctuation">.</span>write<span class="token punctuation">(</span>s<span class="token punctuation">)</span>\n    target<span class="token punctuation">.</span>close<span class="token punctuation">(</span><span class="token punctuation">)</span>\n\n<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">\'__main__\'</span><span class="token punctuation">:</span>\n    main<span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>\n      </div>\n<p>Afterwards we can open up both files side by side to see the difference. </p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-97451.jpeg"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 698px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 57.306590257879655%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAIBBf/EABYBAQEBAAAAAAAAAAAAAAAAAAIAA//aAAwDAQACEAMQAAAB5UsWVCX/xAAXEAADAQAAAAAAAAAAAAAAAAAAEBEB/9oACAEBAAEFAooaVf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAEDAQE/AUf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAWEAADAAAAAAAAAAAAAAAAAAAQIDH/2gAIAQEABj8CFT//xAAaEAADAAMBAAAAAAAAAAAAAAAAARFRYXGh/9oACAEBAAE/IXtSHL0ZorJT/9oADAMBAAIAAwAAABDPz//EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAwEBPxDGFf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAECAQE/EKr/xAAcEAEAAgEFAAAAAAAAAAAAAAABABHwITFRcZH/2gAIAQEAAT8QANnS5fLiNMXkUoaITC5n/9k=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px transparent;"\n        alt="Obfuscation"\n        title=""\n        src="/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-97451.jpeg"\n        srcset="/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-ae332.jpeg 200w,\n/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-98ccf.jpeg 400w,\n/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-97451.jpeg 698w"\n        sizes="(max-width: 698px) 100vw, 698px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',htmlAst:{type:"root",children:[{type:"element",tagName:"h3",properties:{},children:[{type:"text",value:"Intro"}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"I got to thinking, you can obfuscate js and vbs when serving up code to people, why not Python? Well to there is that whole whitespace thing and lack of semi-colons, but lets see what we can do. "}]},{type:"text",value:"\n"},{type:"element",tagName:"hr",properties:{},children:[]},{type:"text",value:"\n"},{type:"element",tagName:"blockquote",properties:{},children:[{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Obfuscation: "},{type:"element",tagName:"em",properties:{},children:[{type:"text",value:"“To make so confused or opaque as to be difficult to perceive or understand”"}]}]},{type:"text",value:"\n"}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"In terms of programming one usually doesnt purposefully obfuscate their code as they may wish for others to read it. However within the realm of Cyber Security the opposite often holds true. Many of those who are crafting the code behind malware (or for fun in puzzles/competitions like IOCCC) purposefully make their code as difficult to read as possible using obfuscation. Therefore it is relatively important to understand obfuscation when it comes to code analysis."}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Here we will be going through the process of applying basic obfuscation to python code in the below examples."}]},{type:"text",value:"\n"},{type:"element",tagName:"hr",properties:{},children:[]},{type:"text",value:"\n"},{type:"element",tagName:"h3",properties:{},children:[{type:"text",value:"Our initial code"}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Scanner.py is a simple scapy implementation of an arp scan for a local area network. An attacker may find it useful to find all live hosts on a network so they may find potential pivots. However most attackers would probably use something a little more sophisticated in order to remain undetected but for our purposes this will work."}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"python"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-python"]},children:[{type:"element",tagName:"code",properties:{className:["language-python"]},children:[{type:"element",tagName:"span",properties:{className:["token","comment"]},children:[{type:"text",value:"#!/usr/bin/env python"}]},{type:"text",value:"\n \n"},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"from"}]},{type:"text",value:" scapy"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"element",tagName:"span",properties:{className:["token","builtin"]},children:[{type:"text",value:"all"}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"import"}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"*"}]},{type:"text",value:"\n \n"},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"try"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:":"}]},{type:"text",value:"\n    alive"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:","}]},{type:"text",value:"dead"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"text",value:"srp"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"text",value:"Ether"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"text",value:"dst"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'"ff:ff:ff:ff:ff:ff"'}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"/"}]},{type:"text",value:"ARP"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"text",value:"pdst"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:"'192.168.1.0/24'"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:","}]},{type:"text",value:" timeout"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"element",tagName:"span",properties:{className:["token","number"]},children:[{type:"text",value:"2"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:","}]},{type:"text",value:" verbose"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"element",tagName:"span",properties:{className:["token","number"]},children:[{type:"text",value:"0"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    "},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"print"}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'"MAC - IP"'}]},{type:"text",value:"\n    "},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"for"}]},{type:"text",value:" i "},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"in"}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","builtin"]},children:[{type:"text",value:"range"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","number"]},children:[{type:"text",value:"0"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:","}]},{type:"element",tagName:"span",properties:{className:["token","builtin"]},children:[{type:"text",value:"len"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"text",value:"alive"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:":"}]},{type:"text",value:"\n            "},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"print"}]},{type:"text",value:" alive"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"["}]},{type:"text",value:"i"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"]"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"["}]},{type:"element",tagName:"span",properties:{className:["token","number"]},children:[{type:"text",value:"1"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"]"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"hwsrc "},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"+"}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'" - "'}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"+"}]},{type:"text",value:" alive"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"["}]},{type:"text",value:"i"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"]"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"["}]},{type:"element",tagName:"span",properties:{className:["token","number"]},children:[{type:"text",value:"1"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"]"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"psrc\n"},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"except"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:":"}]},{type:"text",value:"\n    "},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"pass"}]}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Here is sample output from Scanner.py. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:"user@ubuntu:~$ sudo python scanner.py \n[sudo] password for user: \nWARNING: No route found for IPv6 destination :: (no default route?)\nMAC - IP\n00:00:11:11:11:11 - 192.168.1.10\ncc:bb:44:33:22:11 - 192.168.1.1\ndd:ee:ae:45:67:34 - 192.168.1.14\nff:dd:78:ad:6d:23 - 192.168.1.4\n00:00:00:70:07:e2 - 192.168.1.30\n00:00:11:22:22:22 - 192.168.1.27"}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Base64 is a common type of encoding that is easy to encode and decode using the python Base64 module. It adds a layer of obfuscation between prying eyes and our code. So the first step we will take will be to encode Scanner.py in Base64. The below code snippet will call the base64 library and encode Scanner.py, then dump it as a single string into output.o"}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"python"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-python"]},children:[{type:"element",tagName:"code",properties:{className:["language-python"]},children:[{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"import"}]},{type:"text",value:" base64 \n"},{type:"element",tagName:"span",properties:{className:["token","comment"]},children:[{type:"text",value:"#Its all pretty self explanatory"}]},{type:"text",value:"\n"},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"def"}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","function"]},children:[{type:"text",value:"main"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:":"}]},{type:"text",value:"\n\n    target"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"element",tagName:"span",properties:{className:["token","builtin"]},children:[{type:"text",value:"open"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'"scanner.py"'}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:","}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'"r"'}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    todo "},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"text",value:" target"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"read"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    target"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"close"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    s"},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"text",value:"base64"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"b64encode"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"text",value:"todo"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    target "},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"="}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","builtin"]},children:[{type:"text",value:"open"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'"output.o"'}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:","}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:'"w"'}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    target"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"write"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"text",value:"s"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n    target"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"."}]},{type:"text",value:"close"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]},{type:"text",value:"\n\n"},{type:"element",tagName:"span",properties:{className:["token","keyword"]},children:[{type:"text",value:"if"}]},{type:"text",value:" __name__ "},{type:"element",tagName:"span",properties:{className:["token","operator"]},children:[{type:"text",value:"=="}]},{type:"text",value:" "},{type:"element",tagName:"span",properties:{className:["token","string"]},children:[{type:"text",value:"'__main__'"}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:":"}]},{type:"text",value:"\n    main"},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:"("}]},{type:"element",tagName:"span",properties:{className:["token","punctuation"]},children:[{type:"text",value:")"}]}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Afterwards we can open up both files side by side to see the difference. "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"\n  "},{type:"element",tagName:"a",properties:{className:["gatsby-resp-image-link"],href:"/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-97451.jpeg",style:"display: block",target:"_blank",rel:["noopener"]},children:[{type:"text",value:"\n  \n  "},{type:"element",tagName:"span",properties:{className:["gatsby-resp-image-wrapper"],style:"position: relative; display: block; ; max-width: 698px; margin-left: auto; margin-right: auto;"},children:[{type:"text",value:"\n    "},{type:"element",tagName:"span",properties:{className:["gatsby-resp-image-background-image"],style:"padding-bottom: 57.306590257879655%; position: relative; bottom: 0; left: 0; background-image: url('data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAALABQDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAIBBf/EABYBAQEBAAAAAAAAAAAAAAAAAAIAA//aAAwDAQACEAMQAAAB5UsWVCX/xAAXEAADAQAAAAAAAAAAAAAAAAAAEBEB/9oACAEBAAEFAooaVf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAEDAQE/AUf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAWEAADAAAAAAAAAAAAAAAAAAAQIDH/2gAIAQEABj8CFT//xAAaEAADAAMBAAAAAAAAAAAAAAAAARFRYXGh/9oACAEBAAE/IXtSHL0ZorJT/9oADAMBAAIAAwAAABDPz//EABYRAQEBAAAAAAAAAAAAAAAAAAEAEf/aAAgBAwEBPxDGFf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oACAECAQE/EKr/xAAcEAEAAgEFAAAAAAAAAAAAAAABABHwITFRcZH/2gAIAQEAAT8QANnS5fLiNMXkUoaITC5n/9k='); background-size: cover; display: block;"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"img",properties:{className:["gatsby-resp-image-image"],style:"width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px transparent;",alt:"Obfuscation",title:"",src:"/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-97451.jpeg",srcSet:["/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-ae332.jpeg 200w","/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-98ccf.jpeg 400w","/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-97451.jpeg 698w"],sizes:["(max-width:","698px)","100vw,","698px"]},children:[]},{type:"text",value:"\n    "}]},{type:"text",value:"\n  "}]},{type:"text",value:"\n  \n  "}]},{type:"text",value:"\n    "}]}],data:{quirksMode:!1}},fields:{slug:"/obfuscating-python/",prefix:"2016-03-03"},frontmatter:{title:"Obfuscating python",subTitle:"Who knew making code difficult to read could be fun?",cover:{childImageSharp:{resize:{src:"/static/obfuscated-12e3f5a2faf691d4c09b0863f1a933f3-ada8c.jpeg"}}}}},author:{id:"/home/fisctf/blog/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p>If you have any feedback feel free to @ me on twitter, Im always looking to learn.  <strong>-AL</strong></p>"},footnote:{id:"/home/fisctf/blog/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:"<!--* built by [greg lobinski](https://www.greglobinski.com) -->"},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/obfuscating-python/"}}}});
//# sourceMappingURL=path---obfuscating-python-8eeb5bcebdbdbfd53fae.js.map