import { capitalize, formatDate, formatPersonNr } from './formatters';

const getPersonCard = (t, person, includeName = false, linkToPerson = false) => {
  const card = {};
  if (!person || !t) return card;

  if (includeName)
    card[t('routes.persons.full_name')] = linkToPerson
      ? { text: person.fullName, link: `/persons/${person.id}` }
      : person.fullName;
  card[t('routes.persons.person_nr')] = formatPersonNr(person.personNr);
  card[t('routes.persons.birth_date')] = formatDate(person.birthDate);
  card[t('routes.persons.gender')] = capitalize(person.gender);
  card[t('routes.persons.address')] = `${person.streetAddress}\n${person.postArea}`;

  return card;
};

export default getPersonCard;
