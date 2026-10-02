// Presentation data only. AI roles and deterministic tools are deliberately distinct.
export const TEAM = [
 {id:'atlas',name:'ATLAS',role:'Security manager',type:'AI agent',color:'#eebd72',skin:'#dba477',hair:'#342a28',task:'Coordinating the security review',tool:'Orchestration',description:'Turns your requests into assignments, follows up with the team and prepares clear reports. You approve escalations.',progress:72,home:[154,199]},
 {id:'nova',name:'NOVA',role:'Risk analyst',type:'AI agent',color:'#8bcac0',skin:'#bc825f',hair:'#20252d',task:'Reviewing the product-search risk',tool:'Risk analysis',description:'Connects scanner evidence with honeypot signals and explains which issues should be addressed first.',progress:64,home:[464,199]},
 {id:'sage',name:'SAGE',role:'Code inspector',type:'Rule-based worker',color:'#9abb82',skin:'#e4b996',hair:'#73503b',task:'Inspecting source-code patterns',tool:'Semgrep',description:'Runs configured Semgrep rules against source code. Reports rule matches; does not reason or make decisions independently.',progress:82,home:[143,373]},
 {id:'bolt',name:'BOLT',role:'Dependency auditor',type:'Rule-based worker',color:'#86b8d5',skin:'#c58c65',hair:'#1e252b',task:'Checking vulnerable packages',tool:'Trivy',description:'Checks dependencies and container images against vulnerability data using Trivy. Passes its results to Nova.',progress:56,home:[351,373]},
 {id:'cipher',name:'CIPHER',role:'Secrets inspector',type:'Rule-based worker',color:'#da9b84',skin:'#edc7a3',hair:'#3b2825',task:'Checking commits for leaked keys',tool:'Gitleaks',description:'Uses Gitleaks patterns to flag potential credentials in code and commit history. Never exposes complete secrets here.',progress:93,home:[143,499]},
 {id:'echo',name:'ECHO',role:'Web tester',type:'Rule-based worker',color:'#d3ca83',skin:'#ac7552',hair:'#20262a',task:'Testing staging web endpoints',tool:'OWASP ZAP',description:'Runs a configured ZAP test against an approved staging target. Follows a test plan rather than acting autonomously.',progress:38,home:[351,499]},
];
export const INITIAL_ACTIVITY = [
 {name:'NOVA',text:'Raised product-search priority after reviewing honeypot evidence.',time:'12:38',tone:'warning'},
 {name:'CIPHER',text:'Flagged a possible credential in deploy/release.sh.',time:'12:36',tone:'normal'},
 {name:'ATLAS',text:'Assigned the staging review to four specialist workers.',time:'12:34',tone:'normal'},
];
