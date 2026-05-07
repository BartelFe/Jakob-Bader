import { Hero } from '@/sections/Hero/Hero';
import { Diagnose } from '@/sections/Diagnose/Diagnose';
import { Werk } from '@/sections/Werk/Werk';
import { Akademie } from '@/sections/Akademie/Akademie';
import { Person } from '@/sections/Person/Person';
import { Dialog } from '@/sections/Dialog/Dialog';
import { ManifestBanner } from '@/components/ManifestBanner/ManifestBanner';
import { MANIFEST_BANNERS } from '@/data/manifest';

export function Landing() {
  const beforeWerk = MANIFEST_BANNERS.find((b) => b.placement === 'before-werk');
  const beforeAkademie = MANIFEST_BANNERS.find((b) => b.placement === 'before-akademie');
  const beforePerson = MANIFEST_BANNERS.find((b) => b.placement === 'before-person');
  const beforeDialog = MANIFEST_BANNERS.find((b) => b.placement === 'before-dialog');

  return (
    <>
      <Hero />
      <Diagnose />
      {beforeWerk ? (
        <ManifestBanner lead={beforeWerk.lead} bold={beforeWerk.bold} coda={beforeWerk.coda} />
      ) : null}
      <Werk />
      {beforeAkademie ? (
        <ManifestBanner lead={beforeAkademie.lead} bold={beforeAkademie.bold} />
      ) : null}
      <Akademie />
      {beforePerson ? <ManifestBanner lead={beforePerson.lead} bold={beforePerson.bold} /> : null}
      <Person />
      {beforeDialog ? <ManifestBanner lead={beforeDialog.lead} bold={beforeDialog.bold} /> : null}
      <Dialog />
    </>
  );
}
