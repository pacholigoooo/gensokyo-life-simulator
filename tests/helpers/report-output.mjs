import {mkdirSync,writeFileSync} from 'node:fs';
import {isAbsolute,join} from 'node:path';

// Evidence is optional; normal verification never rewrites checked-in reports.
export function writeTestReport(name,contents){
 const directory=process.env.TOUHOU_TEST_REPORT_DIR;
 if(!directory)return;
 if(!isAbsolute(directory))throw new Error('TOUHOU_TEST_REPORT_DIR must be an explicit absolute output directory');
 mkdirSync(directory,{recursive:true});
 writeFileSync(join(directory,name),contents);
}
