import paramCase from 'param-case';
import pascalCase from 'pascal-case';

export class FormatService {
  indent(n: number, content: string) {
    const indentation = !!n ? '  '.repeat(n) : '';
    return indentation + content;
  }

  indentFile(n: number, contents: string) {
    return contents.split('\n').map(line => this.indent(n, line));
  }

  className(name: string) {
    return pascalCase(name);
  }

  normalizeName(name: string) {
    return paramCase(name);
  }
}