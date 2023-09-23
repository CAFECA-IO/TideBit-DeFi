import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import useStateRef from 'react-usestateref';
import {I_SUN_ONE_LINK} from '../../constants/config';

enum ISunOne {
  tw = 'zh',
  cn = 'za',
  en = ' ',
}

function useCheckLink(defaultLink: string, baseLink: string) {
  const {i18n} = useTranslation('common');
  const [link, setLink, linkRef] = useStateRef(defaultLink);

  useEffect(() => {
    const checkLinkExists = async () => {
      let language = i18n.language;

      if (defaultLink.includes(I_SUN_ONE_LINK) && ISunOne[language as keyof typeof ISunOne]) {
        language = ISunOne[language as keyof typeof ISunOne];
      }

      try {
        const multiLangLink = `${baseLink}/${language}`;
        const response = await fetch(`/api/proxy?url=${multiLangLink}`);
        const data = await response.text();

        if (response.ok && !data.includes('serverErrorCode')) {
          setLink(multiLangLink);
        } else {
          setLink(defaultLink);
        }
      } catch (error) {
        // Deprecated: check if the internalized link is invalid (20230922 - Shirley)
        // eslint-disable-next-line no-console
        console.error('The targeted link is invalid');
      }
    };

    checkLinkExists();
  }, [i18n.language, defaultLink, baseLink]);

  return linkRef.current;
}

export default useCheckLink;
