import React from 'react';
import Markdown from '@components/common/Markdown';
import { Strings } from '@i18n';


export default function Footer() {
  return (
    <footer>
      <div className="copyright text-center py-3">
        <Markdown source={Strings.Content.FooterCopyright} />
      </div>
    </footer>
  );
}
