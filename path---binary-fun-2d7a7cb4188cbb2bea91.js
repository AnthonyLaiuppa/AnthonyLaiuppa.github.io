webpackJsonp([24168661196239],{799:function(e,t){e.exports={data:{post:{id:"/home/fisctf/blog/content/posts/2016-05-02--binary fun/index.md absPath of file >>> MarkdownRemark",html:'<h3>Binary Fun: With basic binary file analysis</h3>\n<p> A little bit ago I decided CTFs looked like alot of fun and that I want to get involved. At least for me it was a little daunting picking where to start. Some people would start with things they are familiar with but I thought Reverse Engineering sounded cool so I went with that. I got a small binary made by a friend, intended to be similar to a basic reversing challenge, to start with. </p>\n<h2>First steps</h2>\n<p>The file is titled pwd2 and we can run a couple of quick bash commands to see if we can find any useful information. I went ahead and spun up a fresh Ubuntu VM for obvious reasons. Of course lets run it first and see what it wants. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$./pwd2\nPlease supply 3 digit passcode\n222\nNope</code></pre>\n      </div>\n<p>The next thing to do would be to run the file command and see if we can grab any other basic information. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$file pwd2\nELF 64-bit LSB  executable, x86-64, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.24, BuildID&lt;br /&gt;\n[sha1]=82ef1e7313ec65f084871b449de99df70ba27282, stripped</code></pre>\n      </div>\n<p>Alright so it is pretty apparent what it wants. At the time I first received this I didnt know about String Format vulns otherwise I wouldve tried seeing if I couldve gained the password value that way. Additionally I didnt think to try integer underflow or overflow, but I did try a simple buffer overflow and can say that did not work. </p>\n<p>At least now Ive got some more ideas of things to look for. The one useful thing I did get from that file command was that debug symbols are stripped.</p>\n<p>Despite seeing that the binary is stripped, I am still going to try gdb on it. Ive used it before with varying degrees of success and still want to become better with it. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$ gdb ./pwd2\n(gdb) r\nStarting program: /home/user/ex1/pwd2 \ndenied.\n\n[Inferior 1 (process 7311) exited with code 01]\n(gdb)</code></pre>\n      </div>\n<p>Having seemingly hit a wall here, I put a good bit of googling to work. Most on obfuscation of C binaries and things that would try to prevent debuggers. Fortunately I found an article on Securing iOS apps that mentioned a bit about how one may prevent a debugger using dlsym. Dlsym would be dynamically opening a library and calling some sort of function to prevent our debugger. Ubuntu has a nifty tool called ltrace, or library trace, that will call the program and run it until exit. All the while recording all of the dynamic library calls. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$ ltrace ./pwd2\n__libc_start_main(0x4007ed, 1, 0x7fff898547b8, 0x400850 &lt;unfinished ...&gt;\ndlopen(nil, 258)                                                                                         = 0x7f32fd4971c8\ndlsym(0x7f32fd4971c8, &quot;ptrace&quot;)                                                                          = 0x7f32fcd9c4f0\nputs(&quot;denied.\\n&quot;denied.</code></pre>\n      </div>\n<p>So there we have it, ptrace is preventing our debugger. Which is neat new knowledge but Im going to exhaust all other low hanging fruit before I begin to look into what more I can do with that. </p>\n<p>Lets run strings, because sometimes, it really does work. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$ strings ./pwd2\n/lib64/ld-linux-x86-64.so.2\nlibdl.so.2\n_ITM_deregisterTMCloneTable\n__gmon_start__\n_Jv_RegisterClasses\n_ITM_registerTMCloneTable\ndlclose\ndlsym\ndlopen\nlibc.so.6\nexit\n__isoc99_scanf\nputs\n__libc_start_main\nGLIBC_2.2.5\nGLIBC_2.7\nUH-h\nUH-h\n=1\t \n[]A\\A]A^A_\nptrace\ndenied.\nPlease supply 3 digit passcode\nNope\nWin.\n;*3$</code></pre>\n      </div>\n<p>It was unlikely that an int would be stored as a string but it only takes quick moment to verify. </p>\n<p>A big part of learning reverse engineering has been attemping to become comfortable with assembly. I did have to learn and even write some in college so I have a slight heading on where to start. I figure we can objdump the binary to a file and grep through the assembly looking for a cmp instruction.\nLooking at the cmp instruction and the surrodning instructions could give away the spot where the conditional is checking for the passcode. Of course since the binary is stripped, it is going to be quite the ridiculous garbled output. </p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text"> 520   4007ed:   55                      push   %rbp\n 521   4007ee:   48 89 e5                mov    %rsp,%rbp\n 522   4007f1:   48 83 ec 20             sub    $0x20,%rsp\n 523   4007f5:   89 7d ec                mov    %edi,-0x14(%rbp)\n 524   4007f8:   b8 00 00 00 00          mov    $0x0,%eax\n 525   4007fd:   e8 7b ff ff ff          callq  40077d &lt;dlsym@plt+0xfd&gt;\n 526   400802:   bf e8 08 40 00          mov    $0x4008e8,%edi\n 527   400807:   e8 04 fe ff ff          callq  400610 &lt;puts@plt&gt;\n 528   40080c:   48 8d 45 fc             lea    -0x4(%rbp),%rax\n 529   400810:   48 89 c6                mov    %rax,%rsi\n 530   400813:   bf 07 09 40 00          mov    $0x400907,%edi\n 531   400818:   b8 00 00 00 00          mov    $0x0,%eax\n 532   40081d:   e8 3e fe ff ff          callq  400660 &lt;__isoc99_scanf@plt&gt;\n 533   400822:   8b 45 fc                mov    -0x4(%rbp),%eax\n 534   400825:   3d 8f 01 00 00          cmp    $0x18f,%eax\n 535   40082a:   74 11                   je     40083d &lt;dlsym@plt+0x1bd&gt;\n 536   40082c:   bf 0a 09 40 00          mov    $0x40090a,%edi\n 537   400831:   e8 da fd ff ff          callq  400610 &lt;puts@plt&gt;\n 538   400836:   b8 00 00 00 00          mov    $0x0,%eax\n 539   40083b:   eb 0f                   jmp    40084c &lt;dlsym@plt+0x1cc&gt;\n 540   40083d:   bf 0f 09 40 00          mov    $0x40090f,%edi\n 541   400842:   e8 c9 fd ff ff          callq  400610 &lt;puts@plt&gt;\n 542   400847:   b8 00 00 00 00          mov    $0x0,%eax&lt;/</code></pre>\n      </div>\n<p>The assembly code was quite massive with over 1033 lines but I managed to ferret out the above block as one warranting closer examination. Simply because puts and scanf caught my eye. Looking two below the scanf(532) we have cmp at 534. The first value 0x18f is compared against whatever is at %eax. 533 is a mov that takes our value and pushes it to %eax so we can conclude our value at %eax is compared against 0x18f. A quick hex to base 10 conversion reveals 0x18f to be 399. Lets give it a try.</p>\n<div class="gatsby-highlight" data-language="text">\n      <pre class="language-text"><code class="language-text">user@ubuntu:~$ ./pwd2\nPlease supply 3 digit passcode\n399\nWin.</code></pre>\n      </div>\n<p>It worked but Im quite fortunate in the fact that puts and scanf werent also put under dlsym as that wouldve made it a good bit harder to identify. Additionally Im fortunate in that the passcode was stored simply and not obfuscated any further. It was a fun challenge and Im looking forward to doing more of these</p>',htmlAst:{type:"root",children:[{type:"element",tagName:"h3",properties:{},children:[{type:"text",value:"Binary Fun: With basic binary file analysis"}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:" A little bit ago I decided CTFs looked like alot of fun and that I want to get involved. At least for me it was a little daunting picking where to start. Some people would start with things they are familiar with but I thought Reverse Engineering sounded cool so I went with that. I got a small binary made by a friend, intended to be similar to a basic reversing challenge, to start with. "}]},{type:"text",value:"\n"},{type:"element",tagName:"h2",properties:{},children:[{type:"text",value:"First steps"}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"The file is titled pwd2 and we can run a couple of quick bash commands to see if we can find any useful information. I went ahead and spun up a fresh Ubuntu VM for obvious reasons. Of course lets run it first and see what it wants. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:"user@ubuntu:~$./pwd2\nPlease supply 3 digit passcode\n222\nNope"}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"The next thing to do would be to run the file command and see if we can grab any other basic information. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:"user@ubuntu:~$file pwd2\nELF 64-bit LSB  executable, x86-64, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.24, BuildID<br />\n[sha1]=82ef1e7313ec65f084871b449de99df70ba27282, stripped"}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Alright so it is pretty apparent what it wants. At the time I first received this I didnt know about String Format vulns otherwise I wouldve tried seeing if I couldve gained the password value that way. Additionally I didnt think to try integer underflow or overflow, but I did try a simple buffer overflow and can say that did not work. "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"At least now Ive got some more ideas of things to look for. The one useful thing I did get from that file command was that debug symbols are stripped."}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Despite seeing that the binary is stripped, I am still going to try gdb on it. Ive used it before with varying degrees of success and still want to become better with it. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:"user@ubuntu:~$ gdb ./pwd2\n(gdb) r\nStarting program: /home/user/ex1/pwd2 \ndenied.\n\n[Inferior 1 (process 7311) exited with code 01]\n(gdb)"}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Having seemingly hit a wall here, I put a good bit of googling to work. Most on obfuscation of C binaries and things that would try to prevent debuggers. Fortunately I found an article on Securing iOS apps that mentioned a bit about how one may prevent a debugger using dlsym. Dlsym would be dynamically opening a library and calling some sort of function to prevent our debugger. Ubuntu has a nifty tool called ltrace, or library trace, that will call the program and run it until exit. All the while recording all of the dynamic library calls. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:'user@ubuntu:~$ ltrace ./pwd2\n__libc_start_main(0x4007ed, 1, 0x7fff898547b8, 0x400850 <unfinished ...>\ndlopen(nil, 258)                                                                                         = 0x7f32fd4971c8\ndlsym(0x7f32fd4971c8, "ptrace")                                                                          = 0x7f32fcd9c4f0\nputs("denied.\\n"denied.'}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"So there we have it, ptrace is preventing our debugger. Which is neat new knowledge but Im going to exhaust all other low hanging fruit before I begin to look into what more I can do with that. "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"Lets run strings, because sometimes, it really does work. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:"user@ubuntu:~$ strings ./pwd2\n/lib64/ld-linux-x86-64.so.2\nlibdl.so.2\n_ITM_deregisterTMCloneTable\n__gmon_start__\n_Jv_RegisterClasses\n_ITM_registerTMCloneTable\ndlclose\ndlsym\ndlopen\nlibc.so.6\nexit\n__isoc99_scanf\nputs\n__libc_start_main\nGLIBC_2.2.5\nGLIBC_2.7\nUH-h\nUH-h\n=1\t \n[]A\\A]A^A_\nptrace\ndenied.\nPlease supply 3 digit passcode\nNope\nWin.\n;*3$"}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"It was unlikely that an int would be stored as a string but it only takes quick moment to verify. "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"A big part of learning reverse engineering has been attemping to become comfortable with assembly. I did have to learn and even write some in college so I have a slight heading on where to start. I figure we can objdump the binary to a file and grep through the assembly looking for a cmp instruction.\nLooking at the cmp instruction and the surrodning instructions could give away the spot where the conditional is checking for the passcode. Of course since the binary is stripped, it is going to be quite the ridiculous garbled output. "}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:" 520   4007ed:   55                      push   %rbp\n 521   4007ee:   48 89 e5                mov    %rsp,%rbp\n 522   4007f1:   48 83 ec 20             sub    $0x20,%rsp\n 523   4007f5:   89 7d ec                mov    %edi,-0x14(%rbp)\n 524   4007f8:   b8 00 00 00 00          mov    $0x0,%eax\n 525   4007fd:   e8 7b ff ff ff          callq  40077d <dlsym@plt+0xfd>\n 526   400802:   bf e8 08 40 00          mov    $0x4008e8,%edi\n 527   400807:   e8 04 fe ff ff          callq  400610 <puts@plt>\n 528   40080c:   48 8d 45 fc             lea    -0x4(%rbp),%rax\n 529   400810:   48 89 c6                mov    %rax,%rsi\n 530   400813:   bf 07 09 40 00          mov    $0x400907,%edi\n 531   400818:   b8 00 00 00 00          mov    $0x0,%eax\n 532   40081d:   e8 3e fe ff ff          callq  400660 <__isoc99_scanf@plt>\n 533   400822:   8b 45 fc                mov    -0x4(%rbp),%eax\n 534   400825:   3d 8f 01 00 00          cmp    $0x18f,%eax\n 535   40082a:   74 11                   je     40083d <dlsym@plt+0x1bd>\n 536   40082c:   bf 0a 09 40 00          mov    $0x40090a,%edi\n 537   400831:   e8 da fd ff ff          callq  400610 <puts@plt>\n 538   400836:   b8 00 00 00 00          mov    $0x0,%eax\n 539   40083b:   eb 0f                   jmp    40084c <dlsym@plt+0x1cc>\n 540   40083d:   bf 0f 09 40 00          mov    $0x40090f,%edi\n 541   400842:   e8 c9 fd ff ff          callq  400610 <puts@plt>\n 542   400847:   b8 00 00 00 00          mov    $0x0,%eax</"}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"The assembly code was quite massive with over 1033 lines but I managed to ferret out the above block as one warranting closer examination. Simply because puts and scanf caught my eye. Looking two below the scanf(532) we have cmp at 534. The first value 0x18f is compared against whatever is at %eax. 533 is a mov that takes our value and pushes it to %eax so we can conclude our value at %eax is compared against 0x18f. A quick hex to base 10 conversion reveals 0x18f to be 399. Lets give it a try."}]},{type:"text",value:"\n"},{type:"element",tagName:"div",properties:{className:["gatsby-highlight"],dataLanguage:"text"},children:[{type:"text",value:"\n      "},{type:"element",tagName:"pre",properties:{className:["language-text"]},children:[{type:"element",tagName:"code",properties:{className:["language-text"]},children:[{type:"text",value:"user@ubuntu:~$ ./pwd2\nPlease supply 3 digit passcode\n399\nWin."}]}]},{type:"text",value:"\n      "}]},{type:"text",value:"\n"},{type:"element",tagName:"p",properties:{},children:[{type:"text",value:"It worked but Im quite fortunate in the fact that puts and scanf werent also put under dlsym as that wouldve made it a good bit harder to identify. Additionally Im fortunate in that the passcode was stored simply and not obfuscated any further. It was a fun challenge and Im looking forward to doing more of these"}]}],data:{quirksMode:!1}},fields:{slug:"/binary fun/",prefix:"2016-05-02"},frontmatter:{title:"Binary fun",subTitle:"Reverse eningeering sounds cool",cover:{childImageSharp:{resize:{src:"/static/binary-b45733c456dbb38c1e9ac4ff0aaf0bbb-ada8c.jpg"}}}}},author:{id:"/home/fisctf/blog/content/parts/author.md absPath of file >>> MarkdownRemark",html:"<p>If you have any feedback feel free to @ me on twitter, Im always looking to learn.  <strong>-AL</strong></p>"},footnote:{id:"/home/fisctf/blog/content/parts/footnote.md absPath of file >>> MarkdownRemark",html:"<!--* built by [greg lobinski](https://www.greglobinski.com) -->"},site:{siteMetadata:{facebook:{appId:""}}}},pathContext:{slug:"/binary fun/"}}}});
//# sourceMappingURL=path---binary-fun-2d7a7cb4188cbb2bea91.js.map